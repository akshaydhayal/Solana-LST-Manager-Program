import { CheckCircle, Clock, Wallet } from 'lucide-react'
import { useState } from 'react'

const PendingWithdrawlsCard = () => {
    const [isConnected, setIsConnected] = useState(true);
    // Mock data
    const pendingWithdrawals = [
    { amount: '10.5', unlockEpoch: 534, currentEpoch: 532, status: 'pending' },
    { amount: '14.5', unlockEpoch: 533, currentEpoch: 532, status: 'ready' }];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock size={20} />Pending Withdrawals</h3>

        {isConnected ? (
        <div className="space-y-3"> {pendingWithdrawals.map((withdrawal, idx) => (
            <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-xl font-semibold">{withdrawal.amount} SOL</div>
                        <div className="text-xs text-gray-400 mt-1">Unlock Epoch: {withdrawal.unlockEpoch}</div>
                    </div>
                    {withdrawal.status === 'ready' ? (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full border border-green-600/30 flex items-center gap-1">
                        <CheckCircle size={12} />Ready</span>
                    ) : (
                        <span className="px-2 py-1 bg-orange-600/20 text-orange-400 text-xs rounded-full border border-orange-600/30">
                        {withdrawal.unlockEpoch - withdrawal.currentEpoch} epochs</span>
                    )}
                </div>
                <button disabled={withdrawal.status !== 'ready'}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed py-2 rounded-lg text-sm font-medium transition-all">
                    {withdrawal.status === 'ready' ? 'Claim SOL' : 'Waiting...'}
                </button>
            </div>
            ))}
        </div>
        ) : (
        <div className="text-center py-8 text-gray-400">
            <Wallet size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Connect wallet to view withdrawals</p>
        </div>
        )}
    </div>
)}

export default PendingWithdrawlsCard