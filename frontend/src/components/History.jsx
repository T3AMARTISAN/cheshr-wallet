import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import TransactionHistoryCard from "./TransactionHistoryCard";
import {
  ETH_TOKEN_ADDRESS,
  POLYGON_TOKEN_ADDRESS,
  ARBITRUM_TOKEN_ADDRESS,
  OPTIMISM_TOKEN_ADDRESS,
} from "../tokenContracts/tokenAddress";

const TransactionHistory = () => {
  const [tokenAddress, setTokenAddress] = useState([]);
  const [tokenTxHistory, setTokenTxHistory] = useState([]);
  const [cryptoTxHistory, setCryptoTxHistory] = useState([]);
  const [txHistory, setTxHistory] = useState([]);
  const [currentProvider, setCurrentProvider] = useState();
  const { currentNetwork, currentAccount } = useOutletContext;

  const findTokensHistory = async (currentAccount, tokenAddress, ticker) => {
    const erc20Transfers = [];
    try {
      const filter = {
        address: tokenAddress,
        // v6 : topics: [ethers.id("Transfer(address,address,uint256)")],
        // v5
        topics: [ethers.utils.id("Transfer(address,address,uint256)")],
        fromBlock: 54059170, //(await currentProvider.getBlockNumber()) - 10,
        toBlock: 54059177, //await currentProvider.getBlockNumber(),
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
        const blockNumber = log.blockNumber;
        const from = "0x" + log.topics[1].substring(26);
        const to = "0x" + log.topics[2].substring(26);
        // v6 : const value = Number(ethers.formatEther(String(parsedLog[0])));
        // v5
        const value = ethers.utils.formatEther(String(parsedLog[0]));
        erc20Transfers.push([{ blockNumber, from, to, value, ticker }]);
      }

      const tokensHistory = [];
      const addr = currentAccount.toLowerCase();
      for (var transfer of erc20Transfers) {
        if (transfer[0].from === addr) {
          console.log(58, transfer);
          tokensHistory.push([
            {
              blockNumber: transfer[0].blockNumber,
              from: transfer[0].from,
              to: transfer[0].to,
              value: transfer[0].value,
              type: "Sent",
              ticker: ticker,
            },
          ]);
        }
        if (transfer[0].to === addr) {
          tokensHistory.push([
            {
              blockNumber: transfer[0].blockNumber,
              from: transfer[0].from,
              to: transfer[0].to,
              value: transfer[0].value,
              type: "Receive",
              ticker: ticker,
            },
          ]);
        }
      }

      setTokenTxHistory(...tokenTxHistory, tokensHistory);
    } catch (error) {
      console.error(error);
    }
  };

  const findCryptocurrencyHistory = async () => {
    const currentProvider = new ethers.providers.EtherscanProvider(
      "matic",
      process.env.REACT_APP_POLYGONSCAN_API_KEY
    );
    try {
      const history = await currentProvider.getHistory(
        "0x6c25cf6B6F2635dB80e32bB31e6E6131d3042382" /*currentAccount*/
      );

      var cryptoArray = [];
      var ticker = "";
      var currentNetwork = "Polygon";
      if (currentNetwork == "Polygon") {
        ticker = "MATIC";
      } else {
        ticker = "ETH";
      }
      const addr =
        /*currentAccount*/ "0x6c25cf6B6F2635dB80e32bB31e6E6131d3042382".toLowerCase();
      for (const crypto of history) {
        if (crypto.data == "0x") {
          if (crypto.from == addr) {
            cryptoArray.push([
              {
                blockNumber: crypto.blockNumber,
                from: crypto.from,
                to: crypto.to,
                value: ethers.utils.formatEther(String(crypto.value)),
                ticker: ticker,
                type: "Sent",
              },
            ]);
          } else if (crypto.to == addr) {
            cryptoArray.push([
              {
                blockNumber: crypto.blockNumber,
                from: crypto.from,
                to: crypto.to,
                value: ethers.utils.formatEther(String(crypto.value)),
                ticker: ticker,
                type: "Received",
              },
            ]);
          }
        }
      }

      setCryptoTxHistory(cryptoArray);
    } catch (error) {
      console.error(error);
    }
  };

  const convertTimestampToLocalDate = async (blockNumber) => {
    var block = await currentProvider.getBlock(blockNumber);
    var timestamp = block.timestamp;

    const date = new Date(timestamp * 1000);

    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formattedDate;
  };

  useEffect(() => {
    var mergedArray = [];
    cryptoTxHistory?.map((v, i) => {
      mergedArray.push(v);
    });
    tokenTxHistory?.map((v, i) => {
      mergedArray.push(v);
    });

    mergedArray.sort((a, b) => b[0].blockNumber - a[0].blockNumber);

    mergedArray.map(async (v, i) => {
      setTxHistory([
        ...txHistory,
        {
          from: v[0].from,
          to: v[0].to,
          ticker: v[0].ticker,
          type: v[0].type,
          value: v[0].value,
          time: await convertTimestampToLocalDate(v[0].blockNumber),
        },
      ]);
    });
    console.log(mergedArray, 122);
  }, [tokenTxHistory]);
  useEffect(() => {
    console.log(txHistory, 182);
  }, []);

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

    findCryptocurrencyHistory();
    tokenAddress.map(async (v, i) => {
      await findTokensHistory(currentAccount, v.address, v.name);
    });

    // import한 토큰에대한 정보는 로컬스토리지에 있음
    /*const importedTokenData = localStorage.getItem(currentNetwork);
    const importedToken = JSON.parse(importedTokenData);
    importedToken?.map(async (v, i) => {
      //await findTokensHistory(currentAccount, v.address, v.ticker);
    });*/
  }, []);

  // Delay시키는 함수
  // const delay = async () => {
  //   return new Promise((resolve) => setTimeout(resolve, 500));
  // };

  return (
    <div className="container-dashboard dashboard-feed-bg relative flex flex-col">
      <div className="min-h-full m-5">
        <div className="dm-sans font-medium text-xl text-white py-4 mx-8">
          Log
        </div>
        {txHistory?.map((v, i) => (
          <TransactionHistoryCard
            key={i}
            from={v.from}
            to={v.to}
            ticker={v.ticker}
            value={v.value}
            time={v.time}
            type={v.type}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
