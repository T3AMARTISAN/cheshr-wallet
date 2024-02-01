import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Nft from "./components/nft";

const Test = () => {
  const [balance, setBalance] = useState();

  const provider = new ethers.InfuraProvider(
    "sepolia",
    "05d970b98aa746069e0827bf56ed73a8"
  );
  const account = "";
  const pvk = "";
  useEffect(() => {
    const getBalance = async () => {
      const response = await provider.getBalance(account);
      const value = ethers.formatEther(String(response));
      console.log(typeof value);
      setBalance(Number(value));
    };
    getBalance();
  });

  const transaction = () => {
    var signer = new ethers.Wallet(pvk, provider);
    var tx = { to: "342", value: 123123 };
    var send = singer.sendTransaction(tx);
  };

  return (
    <div className="bg-red-100">
      <li>mybalance : {balance}</li>
      <div>
        <Nft />
      </div>
    </div>
  );
};

export default Test;
