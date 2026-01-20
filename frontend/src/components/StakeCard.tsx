import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ArrowDown, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { navState } from '../state/navState';
import { Buffer } from 'buffer';
import * as borsh from "borsh";
import { lstManagerBump, lstManagerPda, lstManagerVaultBump, lstManagerVaultPda, lstMintBump, lstMintPda, PROGRAM_ID } from '../lib/constants';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import * as spl from "@solana/spl-token";
import { lstToSolExchangeRateState } from '../state/lstToSolExchangeRateState';
import toast from 'react-hot-toast';
import { protocolStatsState } from '../state/protocolStatsState';

let serialisedAmountSchema:borsh.Schema={
    struct:{amount:'u64'}
}

const StakeCard = () => {
//   const [stakeAmount, setStakeAmount] = useState<null|number>(null);
  const [txSig, setTxSig] = useState('');
  const [stakeAmount, setStakeAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  let [protocolStats, setProtocolStats] = useRecoilState(protocolStatsState);
  let {connection}=useConnection();
  let wallet=useWallet();

  let userAddress=useRecoilValue(navState);
  let lstToSolExchangeRate=useRecoilValue(lstToSolExchangeRateState);
  console.log("user address : ",userAddress);

  async function stakeSOLToLST(){ 
    if(!userAddress.user_address || !stakeAmount){return;}
    if(stakeAmount > userBalance){
      toast.error(`Insufficient balance. You have ${userBalance} SOL but trying to stake ${stakeAmount} SOL.`);
      return;
    }
    let serialisedDepositAmount=borsh.serialize(serialisedAmountSchema,{amount: stakeAmount*LAMPORTS_PER_SOL});
    let userLstAta=spl.getAssociatedTokenAddressSync(lstMintPda, userAddress.user_address, false, spl.TOKEN_PROGRAM_ID);

    //need to create user lst ata here if not exist
    let userLstAtaDetails=await connection.getAccountInfo(userLstAta,"confirmed");
    let tx=new Transaction();
    if(!userLstAtaDetails){
        let userLstAtaCreateIx=spl.createAssociatedTokenAccountInstruction(userAddress.user_address,userLstAta,userAddress.user_address,lstMintPda,spl.TOKEN_PROGRAM_ID);
        tx.add(userLstAtaCreateIx);
    }

    let ix=new TransactionInstruction({
        programId:PROGRAM_ID,
        keys:[
            {pubkey:userAddress.user_address, isSigner:true, isWritable:true},
            {pubkey:lstManagerPda, isSigner:false, isWritable:true},
            {pubkey:lstManagerVaultPda, isSigner:false, isWritable:true},
            {pubkey:lstMintPda, isSigner:false, isWritable:true},
            {pubkey:userLstAta, isSigner:false, isWritable:true},
            {pubkey:SystemProgram.programId, isSigner:false, isWritable:false},
            {pubkey:spl.TOKEN_PROGRAM_ID, isSigner:false, isWritable:false},
        ],
        data:Buffer.concat([
            Buffer.from([1]),
            Buffer.from(serialisedDepositAmount),
            Buffer.from([lstManagerBump]),
            Buffer.from([lstManagerVaultBump]),
            Buffer.from([lstMintBump]),
        ])
    });
    tx.add(ix);
    // tx.recentBlockhash=(await connection.getLatestBlockhash()).blockhash;
    let txStatus=await wallet.sendTransaction(tx,connection);
    // let txStatus=await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(txStatus,"confirmed");
    const explorerUrl=`https://explorer.solana.com/tx/${txStatus}?cluster=devnet`;
    toast.success(<a className="underline" href={explorerUrl} target="_blank" rel="noreferrer">Your deposit was staked successfully! View on Explorer</a>);
    setTxSig(txStatus);
    setProtocolStats({...protocolStats, protocolTVL: protocolStats.protocolTVL + stakeAmount*LAMPORTS_PER_SOL, lstSupply: protocolStats.lstSupply + stakeAmount/lstToSolExchangeRate});
    console.log("user deposit sol tx status : ",txStatus);
}

  useEffect(()=>{
    async function getUserBalance(user:PublicKey){
        let userBal=await connection.getBalance(user);
        console.log("user balance : ",userBal/LAMPORTS_PER_SOL);
        setUserBalance(userBal/LAMPORTS_PER_SOL);
    }
    if(userAddress.user_address){
        getUserBalance(userAddress.user_address);
    }
  },[connection,wallet,userAddress, txSig])

  return (
    <div className="space-y-2.5"> 
        <div>
            <label className="block text-xs font-medium text-blue-300 mb-1">Amount to Stake</label>
            <div className="relative">
                <input type="number" min="0" value={stakeAmount} onChange={(e) => setStakeAmount( (Number(e.target.value)>=0) ? Number(e.target.value): (Number(e.target.value)*-1))}
                    placeholder="0.00" className={`w-full bg-gradient-to-br from-gray-900/60 to-gray-900/40 border-2 ${stakeAmount > userBalance ? 'border-red-500/50' : 'border-blue-500/30'} text-blue-300 rounded-lg px-3.5 py-2.5 text-lg font-semibold focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20 transition-all`}/>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <span className="text-blue-300 font-medium text-xs">SOL</span>
                    <button className="text-[10px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer px-1.5 py-0.5 rounded hover:bg-blue-500/10 transition-colors" onClick={()=>{
                        setStakeAmount(userBalance/2);
                    }}>HALF</button>
                    <button className="text-[10px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer px-1.5 py-0.5 rounded hover:bg-blue-500/10 transition-colors" onClick={()=>{
                        setStakeAmount(userBalance);
                    }}>MAX</button>
                </div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                <span>Balance: <span className="text-blue-300 font-medium">{userBalance} SOL</span></span>
            </div>
            {stakeAmount > userBalance && (
                <div className="mt-1 text-[10px] text-red-400 font-medium">
                    Insufficient balance. You have {userBalance} SOL but trying to stake {stakeAmount} SOL.
                </div>
            )}
        </div>

        <div className="flex items-center justify-center py-0.5">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center border-2 border-blue-500/30 shadow-md shadow-blue-500/10">
                <ArrowDown size={14} className="text-blue-400" />
            </div>  
        </div>

        <div>
            <label className="block text-xs font-medium text-blue-300 mb-1">You Will Receive</label>
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-2 border-blue-500/30 rounded-lg px-3.5 py-2.5 shadow-lg shadow-blue-500/10">
                <div className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stakeAmount ? (stakeAmount / lstToSolExchangeRate).toFixed(4) : '0.00'}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">dSOL LST Tokens</div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/20 border-2 border-purple-500/30 rounded-lg p-2.5 flex gap-1.5 shadow-lg shadow-purple-500/10">
            <Info size={14} className="text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-[10px] text-gray-300">
                <p className="font-medium text-white mb-0.5">Instant Liquidity</p>
                <p className="text-gray-400">Your dSOL LST tokens are immediately liquid and can be used in DeFi while earning staking rewards.</p>
            </div>
        </div>

        <button disabled={!userAddress.user_address || !stakeAmount || stakeAmount > userBalance} onClick={stakeSOLToLST}
             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30">
            {!userAddress.user_address? 'Connect Wallet' : 'Stake SOL'}
        </button>
    </div>
  )
}
export default StakeCard