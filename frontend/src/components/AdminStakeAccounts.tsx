import { useConnection } from '@solana/wallet-adapter-react';
import { TrendingUp } from 'lucide-react'
import * as borsh from "borsh";
import { lstManagerPda, PROGRAM_ID, stakeRegistryRecordPda } from '../lib/constants';
import { StakeRegistryRecordSchema, valueToU64Schema } from '../lib/borshSchema';
import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';

const AdminStakeAccounts = () => {
  let {connection}=useConnection();
  const stakeAccounts0 = [
    { index: 0, address: '7xJ9...kL2p', amount: 10000, status: 'active', epoch: 1005 },
    { index: 1, address: '9mK3...nP4r', amount: 15000, status: 'active', epoch: 1005 },
    { index: 2, address: '4tH8...qR7s', amount: 20000, status: 'active', epoch: 1004 },
  ];
  async function getAllActiveStakeAccounts(){
    let stakeRegistryPdaData=await connection.getAccountInfo(stakeRegistryRecordPda);
    let deserialisedStakeRegistryPdaData=borsh.deserialize(StakeRegistryRecordSchema, stakeRegistryPdaData?.data);
    let totalStakeAccCount=Number(deserialisedStakeRegistryPdaData.next_stake_index)-1; 

    let stakeAccounts:PublicKey[]=[];
    for(let i=1; i<=totalStakeAccCount; i++){
        let serialisedStakeIndex=borsh.serialize(valueToU64Schema, {value:i});    
        let [nextStakeAccPda,nextStakeAccBump]=PublicKey.findProgramAddressSync([Buffer.from("stake_acc"), Buffer.from(serialisedStakeIndex), lstManagerPda.toBuffer()], PROGRAM_ID)
        stakeAccounts.push(nextStakeAccPda.toBase58());
    }
    console.log("stakeAccounts : ",stakeAccounts);
  }
  getAllActiveStakeAccounts();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-green-400" />
        Active Stake Accounts
        </h3>
        <div className="space-y-3">
        {stakeAccounts0.map((acc) => (
            <div key={acc.index} className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex justify-between items-start mb-2">
                <div className="font-mono text-xs text-gray-400">{acc.address}</div>
                <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30">
                Active
                </span>
            </div>
            <div className="text-lg font-semibold">{acc.amount.toLocaleString()} SOL</div>
            <div className="text-xs text-gray-400 mt-1">Epoch: {acc.epoch}</div>
            </div>
        ))}
        </div>
    </div>
  )
}

export default AdminStakeAccounts