use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct StakeRegistryRecord{
    pub next_stake_index:u64,
    pub next_split_index:u64
}
impl StakeRegistryRecord{
    pub const LEN:usize=16;
}