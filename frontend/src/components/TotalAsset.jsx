import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import NetworkSwitch from "./NetworkSwitch";
import Send from "./SendModal";
import Import from "./ImportModal";
import {
  ETH_TOKEN_ADDRESS,
  POLYGON_TOKEN_ADDRESS,
  ARBITRUM_TOKEN_ADDRESS,
  OPTIMISM_TOKEN_ADDRESS,
} from "../tokenContracts/tokenAddress";
import axios from "axios";

const TotalAsset = () => {
  const testAccount = process.env.REACT_APP_TEST_ACCOUNT;
  const { unit, importOpen, setImportOpen, currentNetwork, totalValue } =
    useOutletContext();
  const [sendOpen, setSendOpen] = useState(false);
  const [date, setDate] = useState("");
  const [currentProvider, setCurrentProvider] = useState();
  const [tokenAddress, setTokenAddress] = useState();
  const [balance, setBalance] = useState([]);
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    const showMyBalance = async () => {
      // 테스트 계정 잔액 표시 (필요 시 로그인 계정으로 수정)
      //const response = await currentProvider.getBalance(testAccount);
      //const value = ethers.utils.formatEther(String(response));
      //setBalance(Number(value));
    };
    showMyBalance();
  }, [balance]);

  // useEffect(() => {
  //   const getDate = () => {
  //     const currentDate = new Date();

  //     const formattedDate = currentDate.toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     });

  //     setDate(formattedDate);
  //   };

  //   getDate();
  // }, [date]);

  //Provider 설정, 검색할 토큰 주소들의 네트워크 설정
  useEffect(() => {
    if (!currentNetwork) return;
    if (currentNetwork == "Polygon") {
      setCurrentProvider(
        new ethers.providers.InfuraProvider(
          "matic",
          process.env.POLYGONSCAN_API_KEY
        )
      );
      setTokenAddress(POLYGON_TOKEN_ADDRESS);
    } else if (currentNetwork == "Ethereum") {
      setCurrentProvider(new ethers.providers.InfuraProvider());
      setTokenAddress(ETH_TOKEN_ADDRESS);
    } else if (currentNetwork == "Arbitrum") {
      setCurrentProvider(new ethers.providers.InfuraProvider());
      setTokenAddress(ARBITRUM_TOKEN_ADDRESS);
    } else if (currentNetwork == "Optimism") {
      setCurrentProvider(new ethers.providers.InfuraProvider());
      setTokenAddress(OPTIMISM_TOKEN_ADDRESS);
    } else if (currentNetwork == "Sepolia") {
      new ethers.providers.EtherscanProvider(
        "sepolia",
        process.env.REACT_APP_ETHERSCAN_API_KEY
      );
    } else if (currentNetwork == "Goerli") {
      new ethers.providers.EtherscanProvider(
        "goerli",
        process.env.REACT_APP_ETHERSCAN_API_KEY
      );
    }
  }, [currentNetwork]);

  useEffect(() => {
    if (!currentProvider || !tokenAddress) return;
    tokenAddress?.map(async (v, i) => {
      console.log(92, v);
      await findERC20Tokens(
        "0x6c25cf6B6F2635dB80e32bB31e6E6131d3042382",
        v.address,
        v.name
      );
    });

    findERC20Tokens();
  }, [currentProvider]);

  // 사용자가 가지고 있는 토큰들의 잔액 검색
  const findERC20Tokens = async (currentAccount, tokenAddress, ticker) => {
    if (!currentAccount || !tokenAddress || !ticker) return;
    const erc20Transfers = [];
    const filter = {
      address: tokenAddress,
      // v6 : topics: [ethers.id("Transfer(address,address,uint256)")],
      // v5
      topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      fromBlock: 53962100, //(await currentProvider.getBlockNumber()) - 100,
      toBlock: 53962200, //await currentProvider.getBlockNumber(),
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
      const from = "0x" + log.topics[1].substring(26);
      const to = "0x" + log.topics[2].substring(26);
      // v6 : const value = Number(ethers.formatEther(String(parsedLog[0])));
      // v5
      const value = Number(ethers.utils.formatEther(String(parsedLog[0])));
      erc20Transfers.push([{ from, to, value }]);
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
    var a;
    try {
      var symbol = "";
      if (ticker == "WETH") {
        symbol = "ETH";
      } else if (ticker == "USDT") {
        a = 1;
      } else {
        symbol = ticker.toUpperCase(); //대문자 변환해서 바이낸스에 넣어줘야 함
        const response = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
        );
        a = response.data.price;
      }
    } catch (error) {
      console.error(error);
    }
    setBalance((prevBalance) => [
      ...prevBalance,
      { ticker: ticker, value: Number(tokenBalances * a) },
    ]);
  };

  useEffect(() => {
    const Sum = async () => {
      var sum = 0;
      var c;

      for (const v of balance) {
        if (isNaN(v.value) == true) {
          sum += 0; //usdt
        } else {
          sum += Number(v.value);
        }
      }

      try {
        setTotalSum(0);

        const result = await currentProvider.getBalance(
          "0x6c25cf6B6F2635dB80e32bB31e6E6131d3042382"
        );
        const value = Number(ethers.utils.formatEther(String(result)));

        var symbol = unit;

        const response = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
        );
        var b = Number(response.data.price);
        c = value * b;
      } catch (error) {
        console.error(error);
      }

      var q = sum + c;

      setTotalSum(q);
    };
    Sum();
  }, [balance]);
  useEffect(() => {}, [totalSum]);

  useEffect(() => {
    setTotalSum(0);
    setBalance([]);
  }, [currentNetwork]);
  return (
    <div className="flex flex-row items-center justify-between mx-4 whitespace-pre">
      <div className="my-14 pb-4">
        {/* 총 자산 (USD) = DeFi + Token */}
        <div className="dm-sans-title-feed linear-bg-text">
          ${Number(totalSum + totalValue).toFixed(4)}
        </div>
        {/* 네트워크별 네이티브 토큰 총 잔액 */}
        {/* <p className="dm-sans-body-feed">
          {totalValue} {unit}
        </p> */}
        <p className="dm-sans-body-feed">{Number(totalSum).toFixed(4)}</p>
        {/* 네트워크 */}
        <NetworkSwitch />
      </div>
      <div className="flex flex-col items-start gap-2 justify-center">
        {/* Import 기능 */}
        {importOpen ? (
          <Import />
        ) : (
          <div
            className="feed-button linear-bg-btn click:bg-purple-300"
            onClick={() => setImportOpen(!importOpen)}
          >
            Import
          </div>
        )}
        {/* Send 기능 */}
        {sendOpen ? (
          <Send sendOpen={sendOpen} setSendOpen={setSendOpen} />
        ) : (
          <div
            className="feed-button linear-bg-btn"
            onClick={() => setSendOpen(!sendOpen)}
          >
            Send
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalAsset;
