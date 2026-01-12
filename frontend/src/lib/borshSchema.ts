import * as borsh from "borsh";

export let lstManagerPdaSchema:borsh.Schema={
    struct:{
        admin:{array:{type:'u8',len:32}},
        lst_mint:{array:{type:'u8',len:32}},
        total_sol_staked:'u64',  
        total_lst_supply:'u64'
    }
}

export let UserWithdrawRequestPdaSchema:borsh.Schema={
    struct:{
        user:{array:{type:'u8',len:32}},
        sol_amount_user_gets:'u64',  
        requested_epoch:'u64',  
        withdraw_status:'u8'
    }
}

export let StakeRegistryRecordSchema:borsh.Schema={
    struct:{
        next_stake_index:'u64',
        next_split_index:'u64'
    }
}

export let valueToU64Schema:borsh.Schema={
    struct:{value:'u64'}
}