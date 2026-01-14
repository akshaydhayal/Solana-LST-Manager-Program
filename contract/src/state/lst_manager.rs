use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::pubkey::Pubkey;

#[derive(BorshSerialize, BorshDeserialize)]
pub struct LSTManager{
    pub admin:Pubkey,
    pub lst_mint:Pubkey,
    pub total_sol_staked:u64,  
    pub total_lst_supply:u64, //@q required or not
    // pub total_pending_withdrawl_sol:u64
}
impl LSTManager{
    pub const LEN:usize=32 + 32 + 8 + 8;
    // pub const LEN:usize=32 + 32 + 8 + 8 + 8;
}