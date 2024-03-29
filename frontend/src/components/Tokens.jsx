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
import axios from "axios";

const Tokens = () => {
  const [tokenAddress, setTokenAddress] = useState([]);
  const [balance, setBalance] = useState([]);
  const [cryptocurrencyBalance, setCryptocurrencyBalance] = useState(0);
  const [cryptocurrencyPrice, setCryptocurrencyPrice] = useState();

  const {
    currentAccount,
    setCurrentAccount,
    unit,
    currentProvider,
    currentNetwork,
  } = useOutletContext();

  const findERC20Tokens = async (currentAccount, tokenAddress, ticker) => {
    if (!currentAccount || !tokenAddress || !ticker) return;

    const erc20Transfers = [];
    const filter = {
      address: tokenAddress,
      // v6 : topics: [ethers.id("Transfer(address,address,uint256)")],
      // v5
      topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      fromBlock: 54059140, //(await currentProvider.getBlockNumber()) - 100,
      toBlock: 54059177, //await currentProvider.getBlockNumber(),
    };

    const logs = await currentProvider.getLogs(filter);
    console.log(logs);
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
  };

  useEffect(() => {
    if (!currentNetwork) return;
    if (currentNetwork == "Polygon") {
      setTokenAddress(POLYGON_TOKEN_ADDRESS);
    } else if (currentNetwork == "Ethereum") {
      setTokenAddress(ETH_TOKEN_ADDRESS);
    } else if (currentNetwork == "Arbitrum") {
      setTokenAddress(ARBITRUM_TOKEN_ADDRESS);
    } else if (currentNetwork == "Optimism") {
      setTokenAddress(OPTIMISM_TOKEN_ADDRESS);
    }
  }, [currentNetwork]);

  useEffect(() => {
    console.log(102, tokenAddress);
    if (!tokenAddress) return;
    tokenAddress?.map(async (v, i) => {
      await findERC20Tokens(currentAccount, v.address, v.name);
    });

    const importedTokenData = localStorage.getItem(currentNetwork);
    const importedToken = JSON.parse(importedTokenData);
    importedToken?.map((v, i) => {
      setBalance((prevBalance) => [
        ...prevBalance,
        { ticker: v.ticker, value: v.value },
      ]);
    });
  }, [tokenAddress]);

  // cryptocurrency 잔액 불러오기
  useEffect(() => {
    const getBalance = async () => {
      var response = await currentProvider.getBalance(
        "0x6c25cf6B6F2635dB80e32bB31e6E6131d3042382" /*currentAccount*/
      );
      var value = ethers.utils.formatEther(String(response));
      setCryptocurrencyBalance(Number(value));
    };
    getBalance();

    const getPrice = async () => {
      var response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${unit}USDT`
      );
      setCryptocurrencyPrice(response.data.price);
    };
    getPrice();
  }, []);

  return (
    <div className="container-dashboard dashboard-feed-bg relative flex flex-col">
      <div className="flex flex-row justify-between items-center py-4 mx-8">
        <div className="dm-sans font-medium text-xl text-white">Tokens</div>
        <div className="dm-sans font-base text-purple-50 flex flex-col justify-center items-center">
          <div className="text-xs text-purple-100">Total Value:</div>
          <div className="text-2xl"> ${totalValue.toFixed(2)}</div>
        </div>
      </div>
      {/*cryptocurrency 잔액 나타내기*/}
      <div className="token-container">
        {/* 심볼이미지 */}
        <div className="token-symbol relative bg-opacity-35">
          /*
          <img
            src="https://raw.githubusercontent.com/dorianbayart/CryptoLogos/main/dist/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
            alt="USDC"
            className="absolute inset-0 m-auto rounded-full w-8 h-8 shadow drop-shadow-md"
          />
          */
        </div>
        <div className="grow flex justify-between text-lg">
          <div className="flex flex-col items-start pl-2">
            {/* 틱커 */}
            <div className="dm-sans-token-info">
              {cryptocurrencyBalance.toFixed(4)}
            </div>
            <div className="dm-sans-body-feed text-base text-purple-100">
              {unit}
            </div>
          </div>
          <div className="flex flex-col items-end">
            {/*USD 가치*/}
            <div className="dm-sans-token-info">
              {Number(cryptocurrencyBalance * cryptocurrencyPrice).toFixed(4)}
            </div>
            {/*시세*/}
            <div className="dm-sans-body-feed text-base text-purple-100">
              {Number(cryptocurrencyPrice).toFixed(4)}
            </div>
          </div>
        </div>
      </div>
      {/*ERC 토큰 잔액 나타내기 */}
      {balance?.map((v, i) => (
        <TokenCard key={i} ticker={v.ticker} value={v.value} />
      ))}
    </div>
  );
};

export default Tokens;
