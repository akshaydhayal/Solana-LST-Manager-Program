import { CheckCircle, Clock, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { navState } from '../state/navState';
import {getUserWithdrawRequest } from '../lib/helpers';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { lstManagerBump, lstManagerPda, lstManagerWithdrawVaultBump, lstManagerWithdrawVaultPda, PROGRAM_ID } from '../lib/constants';
import { Buffer } from 'buffer';
import toast from 'react-hot-toast';

const PendingWithdrawlsCard = () => {
  let {connection}=useConnection();
  let wallet=useWallet();

  const [userWithdrawData, setUserWithdrawData] = useState(null);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  let userAddress=useRecoilValue(navState);
  console.log("userWithdrawData : ",userWithdrawData);
  //@ts-ignore
  console.log("userWithdrawData requested_epoch : ",userWithdrawData?.requested_epoch);

  console.log("lstManagerWithdrawVaultPda : ",lstManagerWithdrawVaultPda.toBase58());
  useEffect(()=>{
    async function getWithdrawData(){
        console.log("getWithdrawData run");
        if(!userAddress.user_address){return;}
        let userWithdrawRequestData=await getUserWithdrawRequest(userAddress.user_address,connection);
        console.log("data : ",userWithdrawRequestData);
        //@ts-ignore
        setUserWithdrawData(userWithdrawRequestData);
        // user_withdraw_request_data.withdraw_status=UserWithdrawStatus::COMPLETED;
    }
    async function getCurrentEpoch(){
        let epoch=(await connection.getEpochInfo()).epoch;
        setCurrentEpoch(epoch);
    }
    getCurrentEpoch();
    getWithdrawData();
},[userAddress, connection])

  async function claimSolFromWithdrawVault(){
    if(!userAddress.user_address){return;}
    let [userWithdrawRequestPda,userWithdrawRequestBump]=PublicKey.findProgramAddressSync([Buffer.from("user_withdraw_request"), userAddress.user_address?.toBuffer()],PROGRAM_ID);

    let ix=new TransactionInstruction({
        programId:PROGRAM_ID,
        keys:[
            {pubkey:userAddress.user_address, isSigner:true, isWritable:true},
            {pubkey:lstManagerPda, isSigner:false, isWritable:true},
            {pubkey:lstManagerWithdrawVaultPda, isSigner:false, isWritable:true},
            {pubkey:userWithdrawRequestPda, isSigner:false, isWritable:true},
            {pubkey:SystemProgram.programId, isSigner:false, isWritable:false},
        ],
        data:Buffer.concat([
            Buffer.from([6]),
            Buffer.from([lstManagerBump]),
            Buffer.from([lstManagerWithdrawVaultBump]),
            Buffer.from([userWithdrawRequestBump]),
        ])
    });
    let tx=new Transaction().add(ix);
    let txStatus=await wallet.sendTransaction(tx,connection);
    await connection.confirmTransaction(txStatus,"confirmed");
    const explorerUrl=`https://explorer.solana.com/tx/${txStatus}?cluster=devnet`;
    toast.success(<a className="underline" href={explorerUrl} target="_blank" rel="noreferrer">Your SOL was claimed successfully! View on Explorer</a>);
    console.log("claim sol txStatus : ",txStatus);
  }
  // Mock data
//   const pendingWithdrawals = [
//     { amount: '10.5', unlockEpoch: 534, currentEpoch: 532, status: 'pending' },
//     { amount: '14.5', unlockEpoch: 533, currentEpoch: 532, status: 'ready' }
//   ];

  return (
    <div className="bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-800/90 backdrop-blur-sm rounded-xl border border-green-500/20 shadow-lg shadow-green-500/10 p-5">
        <h3 className="text-base font-semibold mb-3.5 flex items-center gap-1.5 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
        <Clock size={18} className="text-green-400" />Pending Withdrawals</h3>

        {userAddress.user_address ? (
        <div className="space-y-2.5">
            {userWithdrawData ? (<div className="bg-gray-900/50 rounded-lg p-3.5 border border-gray-700/50">
                <div className="flex justify-between items-start mb-1.5">
                    <div>
                        {/* @ts-ignore */}
                        <div className="text-lg font-semibold text-white">{Number(userWithdrawData?.sol_amount_user_gets)/LAMPORTS_PER_SOL} SOL</div>
                        {/* @ts-ignore */}
                        <div className="text-[10px] text-gray-400 mt-0.5">Withdraw Status: {Number(userWithdrawData.withdraw_status)}</div>
                        {/* @ts-ignore */}
                        <div className="text-[10px] text-gray-400 mt-0.5">Requested Epoch: {Number(userWithdrawData.requested_epoch)}</div>
                        {/* @ts-ignore */}
                        <div className="text-[10px] text-gray-400 mt-0.5">Unlock Epoch: {Number(userWithdrawData.requested_epoch)+1}</div>
                        {/* <div className="text-xs text-gray-400 mt-1">Current Epoch: {currentEpoch}</div> */}
                    </div>
                    {/* {withdrawal.status === 'ready' ? ( */}
                    {/* @ts-ignore */}
                    {currentEpoch >= (Number(userWithdrawData.requested_epoch) +1) ? (
                        <span className="px-1.5 py-0.5 bg-green-600/20 text-green-400 text-[10px] rounded-full border border-green-600/30 flex items-center gap-0.5">
                        <CheckCircle size={10} />Ready</span>
                    ) : (
                        <span className="px-1.5 py-0.5 bg-orange-600/20 text-orange-400 text-[10px] rounded-full border border-orange-600/30">
                        {/* {withdrawal.unlockEpoch - withdrawal.currentEpoch} epochs</span> */}
                        {/* Claim after {currentEpoch - Number(userWithdrawData.requested_epoch)} epoch</span> */}
                        Claim after 1 epoch</span>
                    )}
                </div>

                 {/* @ts-ignore */}
                 <button onClick={claimSolFromWithdrawVault} disabled={currentEpoch < (Number(userWithdrawData.requested_epoch)+1)}
                     className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-500 hover:from-green-500 hover:via-emerald-500 hover:to-teal-400 hover:shadow-xl hover:shadow-green-500/50 disabled:from-gray-800 disabled:via-gray-800 disabled:to-gray-800 disabled:cursor-not-allowed disabled:text-gray-200 disabled:border-2 disabled:border-green-500/50 py-1.5 rounded-lg text-xs font-medium transition-all text-white">
                    {/* @ts-ignore */}
                     {currentEpoch >= (Number(userWithdrawData.requested_epoch)+1) ? 'Claim SOL Now' : 'Waiting for epoch end...'}
                 </button>
            </div>
        ) : (
            <p className="text-gray-400 text-xs text-center py-3.5">
                No Pending Withdrawls for User
            </p>
        )
        }
        </div>
        ) : (
        <div className="text-center py-7 text-gray-400">
            <Wallet size={28} className="mx-auto mb-1.5 opacity-50" />
            <p className="text-xs">Connect wallet to view withdrawals</p>
        </div>
        )}
    </div>
)}

export default PendingWithdrawlsCard