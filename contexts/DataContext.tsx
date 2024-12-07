declare let window: any;
import { createContext, useContext, useState } from "react";
import Web3 from "web3";
import Polymarket from "../abis/Polymarket.json";

interface DataContextProps {
  account: string;
  loading: boolean;
  loadWeb3: () => Promise<void>;
  polymarket: any;
  tokenBalance: any;
}

const DataContext = createContext<DataContextProps>({
  account: "",
  loading: true,
  loadWeb3: async () => { },
  polymarket: null,
  tokenBalance: null,
});

export const DataProvider: React.FC = ({ children }) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps>(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [polymarket, setPolymarket] = useState<any>();
  const [tokenBalance, setTokenBalance] = useState<any>();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Eth browser detected. Please consider using MetaMask.");
      return;
    }
    var allAccounts = await window.web3.eth.getAccounts();
    var balance = await window.web3.eth.getBalance(allAccounts[0]);
    setTokenBalance(balance);
    setAccount(allAccounts[0]);
    await loadBlockchainData();
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;


    if (true) {
      var tempContract = await new web3.eth.Contract(
        Polymarket,
        "0xB4A782F820e372740E2f88CFFC681e07d2ba7945"
      );
      setPolymarket(tempContract);
    } else {
      window.alert("TestNet not found");
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    account,
    polymarket,
    tokenBalance,
    loading,
    loadWeb3,
  };
};
