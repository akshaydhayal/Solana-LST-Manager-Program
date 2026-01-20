import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import "@solana/wallet-adapter-react-ui/styles.css";
import { RecoilRoot } from "recoil";
import AppGate from "./pages/AppGate";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  let endpoint=clusterApiUrl("devnet")
  return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <RecoilRoot>
              <Navbar/>
              <Toaster position="top-right" toastOptions={{ duration: 10000 }} />
              <AppGate/>
              {/* <Routes>
                <Route path="/" element={<UserPage/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
              </Routes> */}
            </RecoilRoot>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  )
}
export default App
