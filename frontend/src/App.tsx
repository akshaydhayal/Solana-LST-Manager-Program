import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import "@solana/wallet-adapter-react-ui/styles.css";
import DepositSOL from "./components/DepositSOL";
import { Buffer } from "buffer";
import { Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import { RecoilRoot } from "recoil";

function App() {
  let endpoint=clusterApiUrl("devnet")
  return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            {/* <DepositSOL/> */}
            <RecoilRoot>
              <Routes>
                <Route path="/" element={<UserPage/>}/>
              </Routes>
            </RecoilRoot>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  )
}
export default App
