import { useOutletContext } from "react-router-dom";
import TokenCard from "./TokenCard";
import { ethers } from "ethers";
import {
  ETH_TOKEN_ADDRESS,
  POLYGON_TOKEN_ADDRESS,
  ARBITRUM_TOKEN_ADDRESS,
  OPTIMISM_TOKEN_ADDRESS,
} from "../tokenContracts/tokenAddress";
import { useEffect, useState } from "react";

const Tokens = () => {
  const [tokenAddress, setTokenAddress] = useState([]);
  const [balance, setBalance] = useState([]);

  const { password, currentAccount, currentProvider, currentNetwork } =
    useOutletContext();

  const findERC20Tokens = async (currentAccount, tokenAddress, ticker) => {
    const erc20Transfers = [];
    const filter = {
      address: tokenAddress,
      topics: [ethers.id("Transfer(address,address,uint256)")],
      fromBlock: (await currentProvider.getBlockNumber()) - 100000,
      toBlock: await currentProvider.getBlockNumber(),
    };
    const logs = await currentProvider.getLogs(filter);
    for (const log of logs) {
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const parsedLog = abiCoder.decode(["uint256"], log.data);
      const tokenAddress = log.address;
      const from = "0x" + log.topics[1].substring(26);
      const to = "0x" + log.topics[2].substring(26);
      const value = Number(ethers.formatEther(String(parsedLog[0])));
      erc20Transfers.push([{ tokenAddress, from, to, value }]);
    }

    var tokenBalances = 0;
    const addr = currentAccount.toLowerCase();
    for (const transfer of erc20Transfers) {
      if (transfer[0].from === addr) {
        if (tokenBalances === 0) {
          tokenBalances = -transfer[0].value;
        } else {
          tokenBalances -= transfer[0].value;
        }
      }
      if (transfer[0].to === addr) {
        if (tokenBalances === 0) {
          tokenBalances = transfer[0].value;
        } else {
          tokenBalances += transfer[0].value;
        }
      }
    }
    setBalance([{ ticker: ticker, value: tokenBalances }]);
  };
  useEffect(() => {
    if (currentNetwork == "Polygon") {
      setTokenAddress(POLYGON_TOKEN_ADDRESS);
    } else if (currentNetwork == "Ethereum") {
      setTokenAddress(ETH_TOKEN_ADDRESS);
    } else if (currentNetwork == "Arbitrum") {
      setTokenAddress(ARBITRUM_TOKEN_ADDRESS);
    } else if (currentNetwork == "Optimism") {
      setTokenAddress(OPTIMISM_TOKEN_ADDRESS);
    }
    console.log("network");
  }, [currentNetwork]);

  useEffect(() => {
    console.log(currentNetwork);
    tokenAddress.map((v, i) => {
      findERC20Tokens(currentAccount, v.address, v.name);
    });
    console.log(balance);
  }, [balance]);

  return (
    <div className="bg-neutral-400 rounded-lg h-fit pb-10 flex flex-col">
      <div className="flex flex-row justify-between"></div>
      <div className="flex flex-row justify-between   text-neutral-200"></div>
      {balance.map((v, i) => (
        <TokenCard key={i} ticker={v.ticker} value={v.value} />
      ))}
    </div>
  );
};

export default Tokens;
