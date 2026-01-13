import { useConnection } from '@solana/wallet-adapter-react';
import { getLSTMintSupply, getProtocolTVL } from '../lib/helpers';
import StatCard from './StatCard'
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { navState } from '../state/navState';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ArrowDownUp, Coins, TrendingUp } from 'lucide-react';

const StatsGrid = () => {
  let {connection}=useConnection();
    // const [activeTab, setActiveTab] = useState('stake');
    // const [isConnected, setIsConnected] = useState(false);
  const [protocolTVL, setProtocolTVL] = useState<null|number>(null);   
  const [LstSupply, setLstSupply] = useState<null|number>(null);

    const stats = {
    tvl: '12,450,000',
    apy: '7.2',
    exchangeRate: '1.042',
    yourStake: '150.5',
    yourLST: '144.3',
    pendingUnstake: '25.0'
    };
  
  let userAddress=useRecoilValue(navState);

  async function getProtocolInfo(){
    let protocolTvl=await getProtocolTVL(connection);
    if(protocolTvl){
        setProtocolTVL(protocolTvl);
    }
    let lstMintSupply=await getLSTMintSupply(connection);
    setLstSupply(lstMintSupply);
    // await fetchAllWithdrawRequest(connection);
}
  getProtocolInfo();
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">  
        {/* <StatCard label="Total Value Locked" value={`${stats.tvl} SOL`} */}
        <StatCard label="Total Value Locked (TVL)" value={`${protocolTVL/LAMPORTS_PER_SOL} SOL`}
            icon={Coins} gradient="from-purple-600/20 to-purple-800/20 border border-purple-600/20"/>
        <StatCard label="Total LST Supply" value={`${LstSupply} LST`}
            icon={Coins} gradient="from-purple-600/20 to-purple-800/20 border border-purple-600/20"/>
        <StatCard label="Current APY" value={`${stats.apy}%`} subtext="Est. annual yield"
            icon={TrendingUp} gradient="from-blue-600/20 to-blue-800/20 border border-blue-600/20"/>
        
        <StatCard label="Exchange Rate" value={(protocolTVL/(LAMPORTS_PER_SOL*LstSupply))} subtext="LST per SOL"
            icon={ArrowDownUp} gradient="from-green-600/20 to-green-800/20 border border-green-600/20"/>
        {/* <StatCard label="Your Staked SOL" value={isConnected ? `${stats.yourStake} SOL` : '—'}
        subtext={isConnected ? `${stats.yourLST} LST` : 'Connect wallet'} icon={Wallet}
        gradient="from-pink-600/20 to-pink-800/20 border border-pink-600/20"/> */}
    </div>
  )
}

export default StatsGrid