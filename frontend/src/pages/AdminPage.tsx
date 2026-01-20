import { useState } from 'react';
import { TrendingUp, TrendingDown, Database } from 'lucide-react';
import AdminSplitStakeAccounts from '../components/AdminSplitStakeAccounts';
import AdminStakeAccounts from '../components/AdminStakeAccounts';
import AdminWithdraw from '../components/AdminWithdraw';
import AdminUnstake from '../components/AdminUnstake';
import AdminStake from '../components/AdminStake';
import StatsGrid from '../components/StatsGrid';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('stake');
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 text-white p-0">
        <div className="max-w-6xl mx-auto px-5 py-7">
            {/* <Navbar/> */}
            <StatsGrid/>
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-6xl mx-auto px-0 py-0">
                <div className="lg:col-span-2 space-y-5">
                    <div className="bg-gradient-to-br from-gray-800/90 via-gray-800/80 to-gray-800/90 backdrop-blur-sm rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/10 p-2 flex gap-1.5">
                        <button onClick={() => setActiveTab('stake')}
                            className={`flex-1 py-2.5 px-3.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${activeTab === 'stake' ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30 text-white' : 'bg-gray-900/50 text-gray-400 hover:bg-gray-900 hover:text-green-400'} cursor-pointer`}>
                            <TrendingUp size={16}/>
                            <p className=''>Stake SOL to Validator</p>
                        </button>
                        <button onClick={() => setActiveTab('unstake')} 
                            className={`flex-1 py-2.5 px-3.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${activeTab === 'unstake'? 'bg-gradient-to-r from-orange-600 to-red-600 shadow-lg shadow-orange-500/30 text-white': 'bg-gray-900/50 text-gray-400 hover:bg-gray-900 hover:text-orange-400'} cursor-pointer`}>
                            <TrendingDown size={16} />Unstake from Validator
                        </button>
                        <button onClick={() => setActiveTab('withdraw')}
                            className={`flex-1 py-2.5 px-3.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${ activeTab === 'withdraw'? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 text-white': 'bg-gray-900/50 text-gray-400 hover:bg-gray-900 hover:text-purple-400' } cursor-pointer`}>
                            <Database size={16} />Withdraw from Split
                        </button>
                    </div>
                    {activeTab === 'stake' && (<AdminStake/>)}
                    {activeTab === 'unstake' && (<AdminUnstake/>)}
                    {activeTab === 'withdraw' && (<AdminWithdraw/>)}
                </div>
                <div className="space-y-5">
                    <AdminStakeAccounts/>
                    <AdminSplitStakeAccounts/>
                </div>
            </div>
        </div>
    </div>
  );
};
export default AdminPage;