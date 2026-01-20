import { atom } from "recoil";

type protocolStatType={ protocolTVL: number, protocolActivePendingWithdrawls: number, protocolActiveStaked:number, lstSupply:number};

export const protocolStatsState=atom<protocolStatType>({
    key:'protocolStatsState',
    default:{
        protocolTVL:0,
        protocolActivePendingWithdrawls:0,
        protocolActiveStaked:0,
        lstSupply:0
    }
})