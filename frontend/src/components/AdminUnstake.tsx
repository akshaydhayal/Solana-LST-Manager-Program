import { AlertCircle, TrendingDown } from 'lucide-react'
import { useState } from 'react'

const AdminUnstake = () => {
  const [selectedStakeAccount, setSelectedStakeAccount] = useState('');
  const stakeAccounts = [
    { index: 0, address: '7xJ9...kL2p', amount: 10000, status: 'active', epoch: 1005 },
    { index: 1, address: '9mK3...nP4r', amount: 15000, status: 'active', epoch: 1005 },
    { index: 2, address: '4tH8...qR7s', amount: 20000, status: 'active', epoch: 1004 },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingDown size={22} className="text-orange-400" />Unstake SOL
        </h3>

        <div className="space-y-4">
            <div>
                <label className="text-sm text-gray-400 mb-2 block">Select Stake Account</label>
                <select value={selectedStakeAccount} onChange={(e) => setSelectedStakeAccount(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors">
                    <option value="">Choose a stake account...</option>
                    {stakeAccounts.map((acc) => (
                        <option key={acc.index} value={acc.index}>
                            {acc.address} - {acc.amount.toLocaleString()} SOL
                        </option>
                    ))}
                </select>
            </div>

            {selectedStakeAccount !== '' && (
                <div className="bg-gray-900/70 border border-gray-700/50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-gray-400">Stake Amount</div>
                            <div className="text-lg font-semibold">{stakeAccounts[parseInt(selectedStakeAccount)].amount.toLocaleString()} SOL</div>
                        </div>
                        <div>
                            <div className="text-gray-400">Current Epoch</div>
                            <div className="text-lg font-semibold">{stakeAccounts[parseInt(selectedStakeAccount)].epoch}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex gap-2 text-sm">
                    <AlertCircle size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="text-orange-300">Unstaking will deactivate this stake account and create a split stake account.SOL will be available for withdrawal after 2-3 epochs.</div>
                </div>
            </div>

            <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-xl py-4 rounded-xl text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedStakeAccount}>Deactivate & Split Stake
            </button>
        </div>
    </div>
  )
}

export default AdminUnstake