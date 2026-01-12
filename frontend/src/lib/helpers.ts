import { useConnection } from "@solana/wallet-adapter-react"
import { lstManagerPda, lstManagerVaultPda, lstMintPda, PROGRAM_ID } from "./constants";
import * as borsh from "borsh";
import { lstManagerPdaSchema, UserWithdrawRequestPdaSchema } from "./borshSchema";
import * as spl from "@solana/spl-token";
import { PublicKey, type Connection } from "@solana/web3.js";
import { Buffer } from "buffer";

export async function getProtocolTVL(){    
    let {connection}=useConnection();
    // let lstMintData=await spl.getMint(connection,lstMintPda,"confirmed",spl.TOKEN_PROGRAM_ID);
    // console.log("lstMintData0 : " ,lstMintData.supply,lstMintData.decimals);
    // let lstSupply=Number(lstMintData.supply) / (Math.pow(10,lstMintData.decimals));
    // console.log("lstMintData0 : " ,lstSupply);
    
    let lstManagerVaultPdaBal=await connection.getBalance(lstManagerVaultPda,"confirmed") - await connection.getMinimumBalanceForRentExemption(0,"confirmed");
    console.log("lstManagerVaultPdaBal : ",lstManagerVaultPdaBal);
    
    let lstManagerPdaData=await connection.getAccountInfo(lstManagerPda,"confirmed");
    if(!lstManagerPdaData){return;}
    let deserialisedLstManagerPdaData=borsh.deserialize(lstManagerPdaSchema,lstManagerPdaData?.data);
    console.log("deserialisedLstManagerPdaData: ",deserialisedLstManagerPdaData);  

    // if(!deserialisedLstManagerPdaData || !deserialisedLstManagerPdaData.total_sol_staked){return;}
    if(!deserialisedLstManagerPdaData){return;}
    let protocolTVL:number=lstManagerVaultPdaBal + Number(deserialisedLstManagerPdaData.total_sol_staked);
    return protocolTVL;
}

export async function getLSTMintSupply(connection:Connection){
    // let {connection}=useConnection();
    let lstMintData=await spl.getMint(connection,lstMintPda,"confirmed",spl.TOKEN_PROGRAM_ID);
    console.log("lstMintData : " ,lstMintData);
    let lstSupply=Number(lstMintData.supply) / (Math.pow(10,lstMintData.decimals));
    return lstSupply;
}

async function fetchAllWithdrawRequest(connection:Connection){
    let user1=new PublicKey("3shLPzr2Dd4d8XShBMrcUnUUoRTf1iEmDDaTXLiBLAC3");
    let [user1WithdrawPda,bump]=PublicKey.findProgramAddressSync([Buffer.from("user_withdraw_request"), user1.toBuffer()], PROGRAM_ID);
    let user1WithdrawPdaData=await connection.getAccountInfo(user1WithdrawPda,"confirmed");
    let deserialisedUser1WithdrawPdaData=borsh.deserialize(UserWithdrawRequestPdaSchema,user1WithdrawPdaData.data);
    console.log()
}