import { useConnection } from '@solana/wallet-adapter-react';
import { TrendingUp } from 'lucide-react'
import * as borsh from "borsh";
import { lstManagerPda, PROGRAM_ID, stakeRegistryRecordPda } from '../lib/constants';
import { stakeAccountsSchema, StakeRegistryRecordSchema, valueToU64Schema } from '../lib/borshSchema';
import { Buffer } from 'buffer';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useEffect } from 'react';
import { useRecoilState} from 'recoil';
import { stakeAccountsState } from '../state/stakeAccountsState';

export type stakeAccountsType={index:number,pubkey:string, stakeAmount:number, activatedEpoch:number}[];

const AdminStakeAccounts = () => {
  let {connection}=useConnection();  
  let [activeStakeAccounts,setActiveStateAccounts]=useRecoilState(stakeAccountsState);

  useEffect(()=>{
    async function getAllActiveStakeAccounts(){
      let stakeRegistryPdaData=await connection.getAccountInfo(stakeRegistryRecordPda);
      if(!stakeRegistryPdaData){return;}
      let deserialisedStakeRegistryPdaData=borsh.deserialize(StakeRegistryRecordSchema, stakeRegistryPdaData?.data);
      //@ts-ignore
      let totalStakeAccCount=Number(deserialisedStakeRegistryPdaData?.next_stake_index)-1; 
  
      let stakeAccount:stakeAccountsType=[];
      for(let i=1; i<=totalStakeAccCount; i++){
          let serialisedStakeIndex=borsh.serialize(valueToU64Schema, {value:i});    
          let [stakeAccPda,_]=PublicKey.findProgramAddressSync([Buffer.from("stake_acc"), Buffer.from(serialisedStakeIndex), lstManagerPda.toBuffer()], PROGRAM_ID)
          
          let stakeAccPdaData=await connection.getAccountInfo(stakeAccPda);
          if(!stakeAccPdaData){return;}
          let deserialisedStakeAccData=borsh.deserialize(stakeAccountsSchema, stakeAccPdaData?.data);
          //@ts-ignore
          if(deserialisedStakeAccData?.stake_discriminator==2){
            stakeAccount.push({
              index:i,
              pubkey:stakeAccPda.toBase58(),
              //@ts-ignore
              stakeAmount:Number(deserialisedStakeAccData.stake_delegation_stake_amount),
              //@ts-ignore
              activatedEpoch:Number(deserialisedStakeAccData.stake_delegation_activation_epoch)
            });
          }
        }
      setActiveStateAccounts(stakeAccount);
      console.log("stakeAccount : ",stakeAccount);
    }
    getAllActiveStakeAccounts();
  },[connection])

  return (
    <div className="bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-800/90 backdrop-blur-sm rounded-xl border-2 border-green-500/20 shadow-lg shadow-green-500/10 p-5">
        <h3 className="text-base font-semibold mb-3.5 flex items-center gap-1.5 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          <TrendingUp size={18} className="text-green-400" />Active Stake Accounts</h3>
        <div className="space-y-2.5">
          {activeStakeAccounts.length>0 ? activeStakeAccounts.map((acc) => (
              <div key={acc.index} className="bg-gray-900/50 rounded-lg p-2.5 border border-gray-700/50">
                <div className="flex justify-between items-start mb-1.5">
                    <div className="font-mono text-[10px] text-gray-400 truncate">{acc.pubkey}</div>
                    <span className="px-1.5 py-0.5 bg-green-600/20 text-green-400 text-[10px] rounded-full border border-green-600/30">Active</span>
                </div>
                <div className="text-base font-semibold text-white">{(acc.stakeAmount/LAMPORTS_PER_SOL)} SOL</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Activation mmmmn Epoch: {acc.activatedEpoch}</div>
              </div>
          )):
          (
          <p className="text-gray-400 text-xs text-center py-3.5">No Active Stake accounts</p>
          )
        }
        </div>
    </div>
  )
}
export default AdminStakeAccounts