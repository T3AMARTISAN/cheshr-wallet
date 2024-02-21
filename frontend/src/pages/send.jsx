import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import MyOwnAsset from "../components/MyOwnAsset";
import axios from "axios";

const Send = () => {
  const [value, setValue] = useState();
  const [toAddress, setToAddress] = useState();
  const [receipt, setReceipt] = useState([]);
  const [myAsset, setMyAsset] = useState([]);
  const [isClick, setIsClick] = useState(false);
  const [currentBalance, setCurrentBalance] = useState();
  const [currentTicker, setCurrentTicker] = useState();
  const [currentTokenAddress, setCurrentTokenAddress] = useState();
  const [api, setApi] = useState();
  const [apiKey, setApiKey] = useState();
  const [isErc, setIsErc] = useState(false);

  const {
    password,
    currentProvider,
    currentNetwork,
    balance,
    unit,
    currentAccount,
  } = useOutletContext();

  const onClickSelectAsset = () => {
    setIsClick(!isClick);
  };
  const onClickSelectOriginal = () => {
    setIsClick(!isClick);
    setCurrentBalance(balance);
    setCurrentTicker(unit);
    setIsErc(false);
  };

  const onSubmitSend = (e) => {
    e.preventDefault();
    if (!isErc) {
      async function Send() {
        try {
          const encryptedJson = localStorage.getItem("dexwalletData");
          // v6 : await ethers.decryptKeystoreJson
          // v5
          const wallet = await ethers.Wallet.fromEncryptedJson(
            encryptedJson,
            password
          );
          const signer = new ethers.Wallet(wallet.privateKey, currentProvider);
          const tx = {
            to: toAddress,
            // v6 : ethers.parseUnits(value, "ether")
            value: ethers.utils.parseEther(value),
          };
          const result = await signer.sendTransaction(tx);
          setReceipt([
            ...receipt,
            {
              from: result.from,
              to: result.to,
              value: Number(result.value),
            },
          ]);
        } catch (error) {
          console.error(error);
        }
      }
      Send();
    } else {
      async function SendToken() {
        if (currentNetwork == "Polygon") {
          setApi("api.polygonscan.com");
          setApiKey(process.env.REACT_APP_POLYGONSCAN_API_KEY);
        } else if (currentNetwork == "Ethereum") {
          setApi("api.etherscan.io");
          setApiKey(process.env.REACT_APP_ETHERSCAN_API_KEY);
        } else if (currentNetwork == "Arbitrum") {
          setApi("api.arbiscan.io");
          setApiKey(process.env.REACT_APP_ARBISCAN_API_KEY);
        } else if (currentNetwork == "Optimism") {
          setApi("api-optimistic.etherscan.io");
          setApiKey(process.env.REACT_APP_OPTIMISMSCAN_API_KEY);
        }
        try {
          const encryptedJson = localStorage.getItem("dexwalletData");
          const wallet = await ethers.Wallet.fromEncryptedJson(
            encryptedJson,
            password
          );
          const signer = new ethers.Wallet(wallet.privateKey, currentProvider);

          const response = await axios.get(
            `https://${api}/api?module=contract&action=getabi&address=${currentTokenAddress}&apikey=${apiKey}`
          );

          var abi = JSON.parse(response.data.result);

          if (abi != "") {
            const contract = new ethers.Contract(
              currentTokenAddress,
              abi,
              signer
            );
            const result = await contract.transfer(
              toAddress,
              // v6 : ethers.parseUnits(value, "ether")
              ethers.utils.parseEther(value)
            );

            setReceipt([
              ...receipt,
              {
                from: currentAccount,
                to: toAddress,
                value: value,
              },
            ]);
          } else {
            console.log("Error");
          }
        } catch (error) {
          console.error(error);
        }
      }
      SendToken();
    }
  };

  useEffect(() => {
    const jsonArray = JSON.stringify(receipt);
    localStorage.setItem("history", jsonArray);
  }, [receipt]);
  useEffect(() => {
    const encryptedJson = localStorage.getItem(currentNetwork);
    setMyAsset(JSON.parse(encryptedJson));
    setCurrentBalance(balance);
    setCurrentTicker(unit);
  }, [currentProvider]);

  return (
    <div className="container overflow-y-auto bg-blue-100">
      <form onSubmit={onSubmitSend}>
        <h3>잔액</h3>

        {isClick ? (
          <div className="bg-red-100 w-52 border border-purple-600">
            {currentBalance} {currentTicker}
            <ul className="border border-black" onClick={onClickSelectOriginal}>
              {balance} {unit}
            </ul>
            {myAsset.map(
              (v, i) =>
                v.value !== "0.0" && (
                  <MyOwnAsset
                    key={i}
                    ticker={v.ticker}
                    value={v.value}
                    tokenAddress={v.address}
                    isClick={isClick}
                    setIsClick={setIsClick}
                    setCurrentBalance={setCurrentBalance}
                    setCurrentTicker={setCurrentTicker}
                    setIsErc={setIsErc}
                    setCurrentTokenAddress={setCurrentTokenAddress}
                  />
                )
            )}
          </div>
        ) : (
          <div
            className="bg-red-100 w-52 border border-black"
            onClick={onClickSelectAsset}
          >
            {currentBalance} {currentTicker}
          </div>
        )}

        <h3>금액 입력</h3>
        <input type="text" onChange={(e) => setValue(e.target.value)}></input>
        <h3>TO : </h3>
        <input
          type="text"
          onChange={(e) => setToAddress(e.target.value)}
        ></input>
        <input type="submit" value="Send" />
      </form>
    </div>
  );
};
export default Send;
