import { AlertCircle, CheckCircle, Database } from 'lucide-react'
import { useState } from 'react'

const AdminWithdraw = () => {
  const [selectedSplitStake, setSelectedSplitStake] = useState('');
  const splitStakeAccounts = [
    { index: 0, address: '2vB5...xT9u', amount: 5000, status: 'deactivating', unlockEpoch: 1006, currentEpoch: 1005 },
    { index: 1, address: '8nC7...yW3v', amount: 7500, status: 'inactive', unlockEpoch: 1005, currentEpoch: 1005 },
    { index: 2, address: '5pD9...zX6w', amount: 3000, status: 'deactivating', unlockEpoch: 1007, currentEpoch: 1005 },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database size={22} className="text-purple-400" />Withdraw from Split Stake
        </h3>
        <div className="space-y-4">
            <div>
                <label className="text-sm text-gray-400 mb-2 block">Select Split Stake Account</label>
                <select value={selectedSplitStake} onChange={(e) => setSelectedSplitStake(e.target.value)} className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
                    <option value="">Choose a split stake account...</option>
                    {splitStakeAccounts.map((acc) => (
                    <option key={acc.index} value={acc.index} disabled={acc.status !== 'inactive'}>
                        {acc.address} - {acc.amount.toLocaleString()} SOL ({acc.status})
                    </option>
                    ))}
                </select>
            </div>

            {selectedSplitStake !== '' && (
                <div className="bg-gray-900/70 border border-gray-700/50 rounded-xl p-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <div className="text-gray-400">Amount</div>
                            <div className="text-lg font-semibold">{splitStakeAccounts[parseInt(selectedSplitStake)].amount.toLocaleString()} SOL</div>
                        </div>
                        <div>
                            <div className="text-gray-400">Status</div>
                            <div className="text-lg font-semibold">
                                {splitStakeAccounts[parseInt(selectedSplitStake)].status === 'inactive' ? (
                                    <span className="text-green-400 flex items-center gap-1"><CheckCircle size={16} /> Ready</span>
                                ) : (
                                    <span className="text-orange-400">Deactivating</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-400">Unlock Epoch</div>
                            <div className="text-lg font-semibold">{splitStakeAccounts[parseInt(selectedSplitStake)].unlockEpoch}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                <div className="flex gap-2 text-sm">
                    <AlertCircle size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="text-purple-300">Only inactive split stake accounts can be withdrawn. SOL will be transferred to the user withdrawal vault.</div>
                </div>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl py-4 rounded-xl text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedSplitStake || splitStakeAccounts[parseInt(selectedSplitStake)]?.status !== 'inactive'}>Withdraw to Vault
            </button>
        </div>
    </div>
  )
}

export default AdminWithdraw