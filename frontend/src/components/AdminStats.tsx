import { CheckCircle, Clock, TrendingUp, Wallet } from 'lucide-react'
import React from 'react'

const AdminStats = () => {
    // Mock data
  const vaultBalance = 10000.5;
  const totalStaked = 85000.25;
  const pendingUnstakes = 15;
  const readyWithdrawals = 5;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Wallet size={16} />
              Vault Balance
            </div>
            <div className="text-2xl font-bold">{vaultBalance.toLocaleString()} SOL</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <TrendingUp size={16} />
              Total Staked
            </div>
            <div className="text-2xl font-bold">{totalStaked.toLocaleString()} SOL</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Clock size={16} />
              Pending Unstakes
            </div>
            <div className="text-2xl font-bold">{pendingUnstakes}</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <CheckCircle size={16} />
              Ready Withdrawals
            </div>
            <div className="text-2xl font-bold text-green-400">{readyWithdrawals}</div>
          </div>
        </div>
  )
}

export default AdminStats