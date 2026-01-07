use solana_program::{
    account_info::{AccountInfo, next_account_info}, entrypoint::ProgramResult,
    instruction::{AccountMeta, Instruction}, msg, program::{invoke, invoke_signed},
    program_error::ProgramError, pubkey::Pubkey, rent::Rent,
    system_instruction::{SystemInstruction, transfer, create_account}, sysvar::Sysvar,
    stake
};
use spl_token::instruction::{mint_to_checked , initialize_mint2};
use borsh::{BorshDeserialize, BorshSerialize};

use crate::{error::LSTErrors, state::LSTManager};

pub fn stake_vault_sol(program_id:&Pubkey, accounts:&[AccountInfo], lst_manager_bump:u8, lst_manager_vault_bump:u8)->ProgramResult{
    let mut accounts_iter=accounts.iter();
    let user=next_account_info(&mut accounts_iter)?;
    let lst_manager_pda=next_account_info(&mut accounts_iter)?;
    let lst_manager_vault_pda=next_account_info(&mut accounts_iter)?;
    let stake_acc=next_account_info(&mut accounts_iter)?;
    
    let system_prog=next_account_info(&mut accounts_iter)?;
    let stake_prog=next_account_info(&mut accounts_iter)?;
    let sys_var_rent=next_account_info(&mut accounts_iter)?;
    
    if !user.is_signer{
        return Err(ProgramError::MissingRequiredSignature);
    }
    if *system_prog.key!=solana_program::system_program::ID{
        return Err(ProgramError::IncorrectProgramId);
    }
    
    let lst_manager_seeds=&["lst_manager".as_bytes(), &lst_manager_bump.to_le_bytes()];
    let lst_manager_derived=Pubkey::create_program_address(lst_manager_seeds,program_id)?;
    msg!("lst manager derived : {}",lst_manager_derived);
    if lst_manager_derived!=*lst_manager_pda.key{
        return Err(LSTErrors::LSTManagerPdaMismatch.into());
    }
    
    let lst_manager_vault_seeds=&["lst_manager_vault".as_bytes(), &lst_manager_pda.key.to_bytes(), &lst_manager_vault_bump.to_le_bytes()];
    let lst_manager_vault_derived=Pubkey::create_program_address(lst_manager_vault_seeds,program_id)?;
    msg!("lst manager vault derived : {}",lst_manager_vault_derived);
    msg!("lst manager vault pda owner : {}",lst_manager_vault_pda.owner);
    
    if *lst_manager_vault_pda.key!=lst_manager_vault_derived{
        return Err(LSTErrors::LSTManagerVaultPdaMismatch.into());
    }

    let rent=Rent::get()?;
    let stake_amount=lst_manager_vault_pda.lamports() - rent.minimum_balance(0);
    msg!("stake amoutn : {}", stake_amount);
    msg!("stake amoutn : {}", lst_manager_vault_pda.lamports());

    //we will first create a skae account whose rent will be payed by user
    //and then we will transfer the stake amount from vault pda to stake account,
    let create_stake_acc_ix=create_account(user.key, stake_acc.key, 
        rent.minimum_balance(stake::state::StakeStateV2::size_of())+stake_amount,
        stake::state::StakeStateV2::size_of() as u64, &stake::program::ID);
    invoke(&create_stake_acc_ix,
         &[user.clone(), stake_acc.clone(), system_prog.clone()],
    )?;
    msg!("stake account created!!");

    // let transfer_stake_amount_from_vault_to_stake_acc_ix=transfer(
    //     lst_manager_vault_pda.key, stake_acc.key, stake_amount);
    // invoke_signed(&transfer_stake_amount_from_vault_to_stake_acc_ix,
    //     &[lst_manager_vault_pda.clone(), stake_acc.clone(), system_prog.clone()],
    //     &[lst_manager_vault_seeds]
    // )?;
    **lst_manager_vault_pda.try_borrow_mut_lamports()?-=stake_amount;
    // **stake_acc.try_borrow_mut_lamports()?+=stake_amount;
    **user.try_borrow_mut_lamports()?+=stake_amount;
    msg!("transferred stake amount to stake account");

    let init_stake_acc_ix=stake::instruction::initialize(stake_acc.key,
        &stake::state::Authorized{staker:*lst_manager_pda.key, withdrawer:*lst_manager_pda.key}, 
        &stake::state::Lockup::default()
    );
    invoke(&init_stake_acc_ix,
        &[stake_acc.clone(), sys_var_rent.clone(), stake_prog.clone()])?; 
    Ok(())
}