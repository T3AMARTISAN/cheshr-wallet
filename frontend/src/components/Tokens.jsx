import { useOutletContext } from "react-router-dom";
import TokenCard from "./TokenCard";
import { ethers } from "ethers";
import {
  ETH_TOKEN_ADDRESS,
  POLYGON_TOKEN_ADDRESS,
} from "../tokenContracts/tokenAddress";
import { useEffect, useState } from "react";

const Tokens = () => {
  const [balance, setBalance] = useState([]);
  const [tokenAddress, setTokenAddress] = useState();

  const { password, currentAccount, currentProvider } = useOutletContext();

  const getBalance = async () => {
    try {
      const encryptedJson = localStorage.getItem("data");
      const wallet = await ethers.decryptKeystoreJson(encryptedJson, password);

      const signer = new ethers.Wallet(wallet.privateKey, currentProvider);

      const network = await currentProvider.getNetwork();
      const chain = network.chainId;
      if (Number(chain) == 137) {
        setTokenAddress(POLYGON_TOKEN_ADDRESS);
      } else {
        setTokenAddress(ETH_TOKEN_ADDRESS);
      }

      const balances = await Promise.all(
        tokenAddress.map(async (v, i) => {
          const contract = new ethers.Contract(v.address, v.abi, signer);
          const result = await contract.balanceOf(currentAccount);
          const value = ethers.formatEther(String(result));
          return { ticker: v.name, value: value };
        })
      );
      setBalance(balances);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getBalance();
    console.log(balance);
  }, [currentAccount]);

  return (
    <div className="bg-neutral-400 rounded-lg h-fit pb-10 flex flex-col">
      <div className="flex flex-row justify-between"></div>
      <div className="flex flex-row justify-between   text-neutral-200"></div>
      {balance?.map((v, i) => (
        <TokenCard key={i} ticker={v.ticker} value={v.value} />
      ))}
      <TokenCard ticker={"USDT"} />
      <TokenCard ticker={"ETH"} />
      <TokenCard ticker={"MATIC"} />
      <TokenCard ticker={"BNB"} />
      <TokenCard ticker={"OP"} />
      <TokenCard ticker={"ARB"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
    </div>
  );
};

export default Tokens;
