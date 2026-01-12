import { lstManagerPda, lstManagerVaultPda, lstMintPda, PROGRAM_ID } from "./constants";
import * as borsh from "borsh";
import { lstManagerPdaSchema, UserWithdrawRequestPdaSchema } from "./borshSchema";
import * as spl from "@solana/spl-token";
import { PublicKey, type Connection } from "@solana/web3.js";
import { Buffer } from "buffer";

export async function getProtocolTVL(connection:Connection){    
    let lstManagerVaultPdaBal=await connection.getBalance(lstManagerVaultPda,"confirmed") - await connection.getMinimumBalanceForRentExemption(0,"confirmed");
    // console.log("lstManagerVaultPdaBal : ",lstManagerVaultPdaBal);
    
    let lstManagerPdaData=await connection.getAccountInfo(lstManagerPda,"confirmed");
    if(!lstManagerPdaData){return;}
    let deserialisedLstManagerPdaData=borsh.deserialize(lstManagerPdaSchema,lstManagerPdaData?.data);
    // console.log("deserialisedLstManagerPdaData: ",deserialisedLstManagerPdaData);  

    // if(!deserialisedLstManagerPdaData || !deserialisedLstManagerPdaData.total_sol_staked){return;}
    if(!deserialisedLstManagerPdaData){return;}
    let protocolTVL:number=lstManagerVaultPdaBal + Number(deserialisedLstManagerPdaData.total_sol_staked);
    return protocolTVL;
}

export async function getLSTMintSupply(connection:Connection){
    let lstMintData=await spl.getMint(connection,lstMintPda,"confirmed",spl.TOKEN_PROGRAM_ID);
    // console.log("lstMintData : " ,lstMintData);
    let lstSupply=Number(lstMintData.supply) / (Math.pow(10,lstMintData.decimals));
    return lstSupply;
}

export async function getUserWithdrawRequest(user:PublicKey, connection:Connection){
    let [userWithdrawPda,bump]=PublicKey.findProgramAddressSync([Buffer.from("user_withdraw_request"), user.toBuffer()], PROGRAM_ID);
    let userWithdrawPdaData=await connection.getAccountInfo(userWithdrawPda,"confirmed");
    if(!userWithdrawPdaData){return;}
    let deserialisedUserWithdrawPdaData=borsh.deserialize(UserWithdrawRequestPdaSchema,userWithdrawPdaData?.data);
    return deserialisedUserWithdrawPdaData;
}

export async function fetchAllWithdrawRequest(connection:Connection){
    console.log("fetch all withdraw requests");
    let user1=new PublicKey("3shLPzr2Dd4d8XShBMrcUnUUoRTf1iEmDDaTXLiBLAC3");
    let [user1WithdrawPda,bump]=PublicKey.findProgramAddressSync([Buffer.from("user_withdraw_request"), user1.toBuffer()], PROGRAM_ID);
    let user1WithdrawPdaData=await connection.getAccountInfo(user1WithdrawPda,"confirmed");
    let deserialisedUser1WithdrawPdaData=borsh.deserialize(UserWithdrawRequestPdaSchema,user1WithdrawPdaData.data);
    console.log("deserialisedUser1WithdrawPdaData : ",deserialisedUser1WithdrawPdaData)
        
    let user2=new PublicKey("BWkUkMnQB449fXF8JVnHTejsbcDrL2i11ut876q1t6w");
    let [user2WithdrawPda,bump2]=PublicKey.findProgramAddressSync([Buffer.from("user_withdraw_request"), user2.toBuffer()], PROGRAM_ID);
    console.log("user2WithdrawPda : ",user2WithdrawPda.toBase58());
}