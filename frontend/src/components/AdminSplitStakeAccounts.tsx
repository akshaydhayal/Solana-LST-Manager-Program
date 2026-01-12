import { CheckCircle, Database } from 'lucide-react'
import React from 'react'

const AdminSplitStakeAccounts = () => {
      const splitStakeAccounts = [
    { index: 0, address: '2vB5...xT9u', amount: 5000, status: 'deactivating', unlockEpoch: 1006, currentEpoch: 1005 },
    { index: 1, address: '8nC7...yW3v', amount: 7500, status: 'inactive', unlockEpoch: 1005, currentEpoch: 1005 },
    { index: 2, address: '5pD9...zX6w', amount: 3000, status: 'deactivating', unlockEpoch: 1007, currentEpoch: 1005 },
  ];
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Database size={20} className="text-purple-400" />
        Split Stake Accounts
        </h3>
        <div className="space-y-3">
        {splitStakeAccounts.map((acc) => (
            <div key={acc.index} className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex justify-between items-start mb-2">
                <div className="font-mono text-xs text-gray-400">{acc.address}</div>
                {acc.status === 'inactive' ? (
                <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30 flex items-center gap-1">
                    <CheckCircle size={10} /> Ready
                </span>
                ) : (
                <span className="px-2 py-0.5 bg-orange-600/20 text-orange-400 text-xs rounded-full border border-orange-600/30">
                    {acc.unlockEpoch - acc.currentEpoch} epochs
                </span>
                )}
            </div>
            <div className="text-lg font-semibold">{acc.amount.toLocaleString()} SOL</div>
            <div className="text-xs text-gray-400 mt-1">Unlock: Epoch {acc.unlockEpoch}</div>
            </div>
        ))}
        </div>
    </div>
  )
}

export default AdminSplitStakeAccounts