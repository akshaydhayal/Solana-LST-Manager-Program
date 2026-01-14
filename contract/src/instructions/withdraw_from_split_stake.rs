use solana_program::{
    account_info::{AccountInfo, next_account_info}, clock::Clock, entrypoint::ProgramResult,
    instruction::{AccountMeta, Instruction,}, msg, program::{invoke, invoke_signed},
    program_error::ProgramError, program_pack::Pack, pubkey::Pubkey, rent::Rent,
    system_instruction::{SystemInstruction, create_account, transfer},
    sysvar::Sysvar, stake
};
use borsh::{BorshDeserialize, BorshSerialize};

use crate::{error::LSTErrors};
use crate::state::{
    lst_manager::LSTManager,
};

pub fn withdraw_from_split_stake(program_id:&Pubkey, accounts:&[AccountInfo], split_stake_acc_index:u64, lst_manager_bump:u8, lst_manager_user_withdrawl_vault_bump:u8, split_stake_acc_bump:u8)->ProgramResult{
    let mut accounts_iter=accounts.iter();
    let user=next_account_info(&mut accounts_iter)?;
    let lst_manager_pda=next_account_info(&mut accounts_iter)?;
    let lst_manager_user_withdrawl_vault_pda=next_account_info(&mut accounts_iter)?;
    let split_stake_acc=next_account_info(&mut accounts_iter)?;

    let sys_var_clock=next_account_info(&mut accounts_iter)?;
    let sys_var_stake_history=next_account_info(&mut accounts_iter)?;
    let stake_prog=next_account_info(&mut accounts_iter)?;

    if !user.is_signer{
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    let lst_manager_seeds=&["lst_manager".as_bytes(), &lst_manager_bump.to_le_bytes()];
    let lst_manager_derived=Pubkey::create_program_address(lst_manager_seeds,program_id)?;
    msg!("lst manager derived : {}",lst_manager_derived);
    if lst_manager_derived!=*lst_manager_pda.key{
        return Err(LSTErrors::LSTManagerPdaMismatch.into()); 
    }
    let mut lst_manager_data=LSTManager::try_from_slice(&lst_manager_pda.data.borrow())?;
    if *user.key!=lst_manager_data.admin{
        return Err(LSTErrors::OnlyAdminAllowed.into());
    }
    
    let rent=Rent::get()?;
    let split_stake_acc_seeds=&["split_stake_acc".as_bytes(), &split_stake_acc_index.to_le_bytes(), lst_manager_pda.key.as_ref(), &[split_stake_acc_bump]];
    let split_stake_acc_derived=Pubkey::create_program_address(split_stake_acc_seeds, program_id)?;
    if *split_stake_acc.key!=split_stake_acc_derived{
        return Err(LSTErrors::SplitStakePdaMismatch.into());
    }

    let lst_manager_user_withdrawl_vault_seeds=&["lst_manager_user_withdrawl_vault".as_bytes(), lst_manager_pda.key.as_ref(), &[lst_manager_user_withdrawl_vault_bump]];
    let lst_manager_user_withdrawl_vault_derived=Pubkey::create_program_address(lst_manager_user_withdrawl_vault_seeds, program_id)?;
    if *lst_manager_user_withdrawl_vault_pda.key!=lst_manager_user_withdrawl_vault_derived{
        return Err(LSTErrors::LSTManagerUserWithdrawlVaultPdaMismatch.into());
    }
    
    //steps:
    //this ix is for admin to call, admin check 
    // withdraw from split stake accou to user withdrawl vault, either it succeds or fails
    //now question, which split stake account to call: like split 1, split 2 , split 3 
    // 3 split stake account may be avaible, so we cant just withdraw from last split index from
    // registry stake pda. this is left for client, client will send the split index from which to withdraw
    
    // client work here: check which split stake account is in deactivate state. and make it to
    // withdraw to user withdraw vault, simpe like split 1 , split 2, split 3 all in deactivate
    // state, send each split account index to this ix simply. and this will with withdraw to withdrawl vault
    //client can make a optimsation like check from index 1 to split index index in stake registry pda.
    // for all these index, make admin to call this instruction.
    
    let withdraw_amount_from_split_stake_acc=split_stake_acc.lamports();
    // let withdraw_amount_from_split_stake_acc=split_stake_acc.lamports()-rent.minimum_balance(200);
    
    let withdraw_from_split_acc_to_user_withdrawl_vault_ix=Instruction::new_with_bincode(
        stake::program::ID,
        &stake::instruction::StakeInstruction::Withdraw(withdraw_amount_from_split_stake_acc),
        vec![
            AccountMeta::new(*split_stake_acc.key, false),
            AccountMeta::new(*lst_manager_user_withdrawl_vault_pda.key, false),
            AccountMeta::new_readonly(*sys_var_clock.key, false),
            AccountMeta::new_readonly(*sys_var_stake_history.key, false),
            AccountMeta::new(*lst_manager_pda.key,true)
        ]
    );
    invoke_signed(&withdraw_from_split_acc_to_user_withdrawl_vault_ix,
        &[split_stake_acc.clone(), lst_manager_user_withdrawl_vault_pda.clone(),sys_var_clock.clone(),
            sys_var_stake_history.clone(), lst_manager_pda.clone(), stake_prog.clone()],
        &[lst_manager_seeds])?;
    msg!("withdrawn from split stake acc to user withdrawl vault pda");
    Ok(())
}