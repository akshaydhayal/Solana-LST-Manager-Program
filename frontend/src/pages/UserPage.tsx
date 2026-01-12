import React, { useState } from 'react';
import { ArrowDownUp, Coins, TrendingUp, Wallet } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import InfoCard from '../components/InfoCard';
import PendingWithdrawlsCard from '../components/PendingWithdrawlsCard';
import Footer from '../components/Footer';
import StakeCard from '../components/StakeCard';
import UnstakeCard from '../components/UnstakeCard';
import { useRecoilValue } from 'recoil';
import { navState } from '../state/navState';
import {  fetchAllWithdrawRequest, getLSTMintSupply, getProtocolTVL } from '../lib/helpers';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';
import * as borsh from "borsh";
import { Buffer } from 'buffer';
import { PROGRAM_ID } from '../lib/constants';
import { UserWithdrawRequestPdaSchema } from '../lib/borshSchema';

const UserPage = () => {
  let {connection}=useConnection();
  const [activeTab, setActiveTab] = useState('stake');
  const [isConnected, setIsConnected] = useState(false);
  const [protocolTVL, setProtocolTVL] = useState<null|number>(null);
  const [LstSupply, setLstSupply] = useState<null|number>(null);

  let userAddress=useRecoilValue(navState);
  async function getProtocolInfo(){
    let protocolTvl=await getProtocolTVL(connection);
    // console.log("protocolTVL : " ,protocolTvl);
    if(protocolTvl){
      setProtocolTVL(protocolTvl);
    }

    let lstMintSupply=await getLSTMintSupply(connection);
    setLstSupply(lstMintSupply);
    // await fetchAllWithdrawRequest(connection);
    }
  getProtocolInfo();

  // Mock data
  const stats = {
    tvl: '12,450,000',
    apy: '7.2',
    exchangeRate: '1.042',
    yourStake: '150.5',
    yourLST: '144.3',
    pendingUnstake: '25.0'
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
        activeTab === id
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}>
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* <Navbar/> */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          {/* <StatCard label="Total Value Locked" value={`${stats.tvl} SOL`} */}
          <StatCard label="Total Value Locked" value={`${protocolTVL/LAMPORTS_PER_SOL} SOL`}
            icon={Coins} gradient="from-purple-600/20 to-purple-800/20 border border-purple-600/20"/>
          <StatCard label="Total LST Supply" value={`${LstSupply} LST`}
            icon={Coins} gradient="from-purple-600/20 to-purple-800/20 border border-purple-600/20"/>
          <StatCard label="Current APY" value={`${stats.apy}%`} subtext="Est. annual yield"
            icon={TrendingUp} gradient="from-blue-600/20 to-blue-800/20 border border-blue-600/20"/>
          
          <StatCard label="Exchange Rate" value={stats.exchangeRate} subtext="LST per SOL"
            icon={ArrowDownUp} gradient="from-green-600/20 to-green-800/20 border border-green-600/20"/>
          {/* <StatCard label="Your Staked SOL" value={isConnected ? `${stats.yourStake} SOL` : '—'}
            subtext={isConnected ? `${stats.yourLST} LST` : 'Connect wallet'} icon={Wallet}
            gradient="from-pink-600/20 to-pink-800/20 border border-pink-600/20"/> */}
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Staking Interface */}
            <div className="lg:col-span-2">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                    {/* Tabs */}
                    <div className="flex gap-3 mb-6">
                        <TabButton id="stake" label="Stake SOL" icon={TrendingUp} />
                        <TabButton id="unstake" label="Unstake" icon={ArrowDownUp} />
                    </div>
                    {activeTab === 'stake' ? (<StakeCard/>) : (<UnstakeCard/>)}
                </div>
            </div>
            {/* Sidebar*/}
            <div className="space-y-6">
                <PendingWithdrawlsCard/>
                <InfoCard/>
            </div>
        </div>
        <Footer/>
      </div>

    </div>
    </div>
)};

export default UserPage;