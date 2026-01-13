import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";

// export const PROGRAM_ID=new PublicKey("DfknHZAbr5LiHxPXXsVrAhs2o93RUmffDzMwZQzMSWv7");
export const PROGRAM_ID=new PublicKey("HSSXMvkzvRjGfHjcXftFbFaUAuMLxvjpejXRPPd89UVK");

export const [lstManagerPda, lstManagerBump]=PublicKey.findProgramAddressSync([Buffer.from("lst_manager")], PROGRAM_ID);
export const [lstManagerVaultPda, lstManagerVaultBump]=PublicKey.findProgramAddressSync([Buffer.from("lst_manager_vault"), lstManagerPda.toBuffer()], PROGRAM_ID);
export const [lstManagerWithdrawVaultPda, lstManagerWithdrawVaultBump]=PublicKey.findProgramAddressSync([Buffer.from("lst_manager_user_withdrawl_vault"), lstManagerPda.toBuffer()], PROGRAM_ID);
export const [lstMintPda, lstMintBump]=PublicKey.findProgramAddressSync([Buffer.from("lst_mint"), lstManagerPda.toBuffer()], PROGRAM_ID);

export const [stakeRegistryRecordPda, stakeRegistryRecordBump]=PublicKey.findProgramAddressSync([Buffer.from("stake_registry_record"), lstManagerPda.toBuffer()], PROGRAM_ID);
