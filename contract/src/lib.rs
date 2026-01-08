use solana_program::{entrypoint};

pub mod processor;
pub mod instruction;
pub mod instructions;
pub mod state;
pub mod error;
pub mod maths;

use processor::process_instruction;
entrypoint!(process_instruction);