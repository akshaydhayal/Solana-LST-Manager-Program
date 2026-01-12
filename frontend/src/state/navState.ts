import type { PublicKey } from "@solana/web3.js";
import { atom } from "recoil";

export const navState=atom<{user_address: null|PublicKey}>({
    key:'navState',
    default:{
        user_address:null,
    }
})