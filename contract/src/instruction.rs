use borsh::{BorshSerialize, BorshDeserialize};
#[derive(BorshDeserialize, BorshSerialize)]
pub enum InstructionType{
    InitialiseLST{ lst_manager_bump:u8, lst_manager_vault_bump:u8, lst_mint_bump:u8},
    // DepositSOL{ deposit_amount:u64, lst_manager_bump:u8, lst_manager_vault_bump:u8, lst_mint_bump:u8, user_position_bump:u8},
    DepositSOL{ deposit_amount:u64, lst_manager_bump:u8, lst_manager_vault_bump:u8, lst_mint_bump:u8},
    StakeVaultSOL{lst_manager_bump:u8, lst_manager_vault_bump:u8, stake_acc_bump:u8},
    BurnLST{burn_lst_amount:u64, lst_manager_bump:u8, lst_manager_vault_bump:u8, lst_mint_bump:u8} //by user
    // UnstakeSOL{amount} // by admin
}