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

  const {
    currentAccount,
    setCurrentAccount,
    /*currentProvider currentNetwork,*/
  } = useOutletContext();

  const findERC20Tokens = async (currentAccount, tokenAddress, ticker) => {
    if (!currentAccount || !tokenAddress || !ticker) return;

    var currentProvider = new ethers.providers.InfuraProvider(
      "matic",
      process.env.REACT_APP_POLYGONSCAN_API_KEY
    );
    const erc20Transfers = [];
    const filter = {
      address: tokenAddress,
      // v6 : topics: [ethers.id("Transfer(address,address,uint256)")],
      // v5
      topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      fromBlock: (await currentProvider.getBlockNumber()) - 100,
      toBlock: await currentProvider.getBlockNumber(),
    };

    const logs = await currentProvider.getLogs(filter);
    for (const log of logs) {
      // v6 : const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      //      const parsedLog = abiCoder.decode(["uint256"], log.data);
      // v5
      const parsedLog = ethers.utils.defaultAbiCoder.decode(
        ["uint256"],
        log.data
      );

      const tokenAddress = log.address;
      const from = "0x" + log.topics[1].substring(26);
      const to = "0x" + log.topics[2].substring(26);
      // v6 : const value = Number(ethers.formatEther(String(parsedLog[0])));
      // v5
      const value = Number(ethers.utils.formatEther(String(parsedLog[0])));
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
    setBalance((prevBalance) => [
      ...prevBalance,
      { ticker: ticker, value: tokenBalances },
    ]);
    //return { ticker: ticker, value: tokenBalances };
  };

  useEffect(() => {
    var currentNetwork = "Polygon";
    if (currentNetwork == "Polygon") {
      setTokenAddress(POLYGON_TOKEN_ADDRESS);
    } else if (currentNetwork == "Ethereum") {
      setTokenAddress(ETH_TOKEN_ADDRESS);
    } else if (currentNetwork == "Arbitrum") {
      setTokenAddress(ARBITRUM_TOKEN_ADDRESS);
    } else if (currentNetwork == "Optimism") {
      setTokenAddress(OPTIMISM_TOKEN_ADDRESS);
    }
  }, []);

  useEffect(() => {
    if (!currentAccount) return;
    tokenAddress?.map(async (v, i) => {
      await findERC20Tokens(
        "0x6c25cf6B6F2635dB80e32bB31e6E6131d3042382",
        v.address,
        v.name
      );
    });
  }, [currentAccount]);

  return (
    <div className="container-dashboard dashboard-bg pt-2 relative flex flex-col">
      <div className="flex-grow overflow-auto">
        <div className="sticky flex flex-row justify-between px-6 py-2 text-base dm-sans-token text-purple-900">
          <div>AMOUNT</div>
          <div>USD VALUE</div>
        </div>
        {balance?.map((v, i) => (
          <TokenCard key={i} ticker={v.ticker} value={v.value} />
        ))}
      </div>
      <div className="sticky bottom-2 text-right bg-green-200 m-2 px-auto dm-sans-token">
        TOTAL VALUE: $108
      </div>
    </div>
  );
};

export default Tokens;
