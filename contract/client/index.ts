import { clusterApiUrl, Connection } from "@solana/web3.js";

console.log("Hello via Bun!");

async function getAllValidators(){
    let connection=new Connection(clusterApiUrl("devnet"),"confirmed")
    let voteAcc=await connection.getVoteAccounts("confirmed");
    console.log("voteAcc : ",voteAcc);
    console.log("voteAcc : ",voteAcc.current.length);
    console.log("voteAcc : ",voteAcc.delinquent.length);
}

getAllValidators();