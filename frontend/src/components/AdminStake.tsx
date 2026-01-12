import { useConnection } from '@solana/wallet-adapter-react';
import { AlertCircle, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { lstManagerVaultPda, PROGRAM_ID } from '../lib/constants';
import { LAMPORTS_PER_SOL, TransactionInstruction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { useRecoilValue } from 'recoil';

const AdminStake = () => {
  let {connection}=useConnection();
  const [stakeAmount, setStakeAmount] = useState<null|number>(null);  
  const [vaultBalance, setVaultBalnce] = useState(0);
  
  let userAddress=useRecoilValue

  useEffect(()=>{
    async function getVaultBal(){
        let lstManagerVaultPdaBal=await connection.getBalance(lstManagerVaultPda,"confirmed") - await connection.getMinimumBalanceForRentExemption(0,"confirmed");
        setVaultBalnce(lstManagerVaultPdaBal);
    }
    getVaultBal();
  },[connection])

  async function stakeVaultSolToValidator(){
    let ix=new TransactionInstruction({
        programId:PROGRAM_ID,
        keys:[
            {pubkey:}
        ],
        data:Buffer.concat([
            Buffer.from([])
        ])
    })
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={22} className="text-green-400" />Stake Vault SOL</h3>

        <div className="space-y-4">
            <div>
                <label className="text-sm text-gray-400 mb-2 block">Available Vault Balance</label>
                <div className="text-3xl font-bold mb-4">{vaultBalance/LAMPORTS_PER_SOL} SOL</div>
            </div>

            <div>
                <label className="text-sm text-gray-400 mb-2 block">Stake Amount</label>
                <div className="relative">
                    <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(Number(e.target.value))}
                        placeholder="0.00" className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-4 text-xl font-semibold focus:outline-none focus:border-green-500 transition-colors"/>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <span className="text-gray-400">SOL</span>
                        <button onClick={() => setStakeAmount(vaultBalance/(2*LAMPORTS_PER_SOL))} className="text-green-400 text-sm font-medium hover:text-green-300 cursor-pointer">
                            HALF
                        </button>
                        <button onClick={() => setStakeAmount(vaultBalance/LAMPORTS_PER_SOL)} className="text-green-400 text-sm font-medium hover:text-green-300 cursor-pointer">
                            MAX
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-2 text-sm">
                    <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-blue-300">This will create a new stake account and delegate SOL from the vault to a validator.Ensure you have selected a validator before proceeding.</div>
                </div>
            </div>

            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-xl py-4 rounded-xl text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}>Create Stake Account
            </button>
        </div>
    </div>
  )
}

export default AdminStake