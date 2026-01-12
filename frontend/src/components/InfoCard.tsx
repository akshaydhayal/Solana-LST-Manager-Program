const InfoCard = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold mb-4">How It Works</h3>
        <div className="space-y-4 text-sm text-gray-300">
            <div>
                <div className="font-medium text-white mb-1">1. Stake SOL</div>
                <p className="text-gray-400">Deposit SOL and receive liquid LST tokens instantly.</p>
            </div>
            <div>
                <div className="font-medium text-white mb-1">2. Earn Rewards</div>
                <p className="text-gray-400">LST tokens automatically accrue staking rewards.</p>
            </div>
            <div>
                <div className="font-medium text-white mb-1">3. Use in DeFi</div>
                <p className="text-gray-400">Trade or use LST in DeFi while earning rewards.</p>
            </div>
            <div>
                <div className="font-medium text-white mb-1">4. Unstake Anytime</div>
                <p className="text-gray-400">Burn LST to unstake. Wait 2-3 epochs, then claim SOL.</p>
            </div>
        </div>
    </div>
)}

export default InfoCard