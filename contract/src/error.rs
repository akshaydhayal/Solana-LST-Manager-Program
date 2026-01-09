use thiserror::{Error};
use solana_program::program_error::ProgramError;

#[derive(Error,Debug)]
pub enum LSTErrors{
    #[error("only LSTManager admin can do this operation")]
    OnlyAdminAllowed,

    #[error("given lst manager pda seeds do not match with correct lst manager seeds")]
    LSTManagerPdaMismatch,

    #[error("given lst manager vault pda seeds do not match with correct lst manager vault seeds")]
    LSTManagerVaultPdaMismatch,

    #[error("given lst mint pda seeds do not match with correct lst mint seeds")]
    LSTMintPdaMismatch,
    
    // #[error("given stake manager pda seeds do not match with correct stake manager seeds")]
    // StakeManagerPdaMismatch,

    #[error("given user withdraw request pda seeds do not match with correct user withdraw request seeds")]
    UserWithdrawRequestPdaMismatch,

    #[error("given epoch withdraw pda seeds do not match with correct epoch withdraw seeds")]
    EpochWithdrawPdaMismatch,
    
    #[error("for given epoch withdraw has already been finalised")]
    EpochWithdrawAlreadyFinalised,

    #[error("given stake acc pda seeds do not match with correct stake account seeds")]
    StakePdaMismatch,

    #[error("given split stake acc pda seeds do not match with correct split stake account seeds")]
    SplitStakePdaMismatch,

    #[error("given stake registry record pda seeds do not match with correct stake registory seeds")]
    StakeRegistryPdaMismatch,
}

impl From<LSTErrors> for ProgramError{
    fn from(e:LSTErrors)->Self{
        return ProgramError::Custom(e as u32);
    }
}