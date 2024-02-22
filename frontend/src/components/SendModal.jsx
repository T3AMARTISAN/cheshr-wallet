import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { HiSelector } from "react-icons/hi";
import MyOwnAsset from "./MyOwnAsset";
import { AuthContext } from "./Auth";
import BackButton from "./Buttons/BackButton";

const Send = ({ setSendOpen, sendOpen }) => {
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

  const { currentProvider, currentNetwork, balance, unit, currentAccount } =
    useOutletContext();
  const { pw } = useContext(AuthContext);

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
          const wallet = await ethers.decryptKeystoreJson(encryptedJson, pw);
          const signer = new ethers.Wallet(wallet.privateKey, currentProvider);
          const tx = {
            to: toAddress,
            value: ethers.parseUnits(value, "ether"),
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
          const wallet = await ethers.decryptKeystoreJson(encryptedJson, pw);
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
              ethers.parseUnits(value, "ether")
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

  const onClickBack = () => {
    setSendOpen(!sendOpen);
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
    <div className="modal-bg radial-bg-home">
      <div className="dm-sans container-modal">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onClickBack}
          className="-translate-x-12 translate-y-8 "
        >
          <BackButton />
        </button>

        {/* 헤더 */}
        <div className="dm-sans-title-feed py-4 text-center">SEND</div>

        {/* 트랜잭션 정보 */}
        <form
          onSubmit={onSubmitSend}
          className="flex flex-col gap-2 justify-center items-center mt-4"
        >
          <div className="flex flex-row justify-center">
            {/* 항목 */}
            <div className="flex flex-col justify-center items-start gap-5 mx-2">
              {/* 보내는 주소 */}
              <div className="dm-sans-title-dashboard bg-lime-200 w-24 px-2">
                TO
              </div>
              <div className="dm-sans-title-dashboard bg-lime-200 w-24 px-2">
                ASSET
              </div>
              <div className="dm-sans-title-dashboard bg-lime-200 w-24 px-2">
                AMOUNT
              </div>
            </div>

            {/* 입력란 */}
            <div className="flex flex-col justify-center items-end gap-3">
              <input
                type="text"
                onChange={(e) => setToAddress(e.target.value)}
                className="modal-inputbox p-2 dm-sans text-sm"
                placeholder="Enter wallet address"
              ></input>
              {/* 토큰 선택 */}
              {isClick ? (
                <>
                  {/* 클릭하면 보유한 토큰 보여주기 */}
                  <div
                    className={`relative z-20 modal-dropdown ${
                      isClick && "rounded-b-none border-b-0"
                    }`}
                    onClick={onClickSelectAsset}
                  >
                    {currentBalance} {currentTicker}
                    <HiSelector />
                  </div>
                  <div
                    className={`absolute translate-y-8 z-20 modal-dropdown ${
                      isClick && "rounded-t-none border-t-0"
                    }`}
                    onClick={onClickSelectOriginal}
                  >
                    <p className="hover:bg-[#9EFFAE]">
                      {balance} {unit}
                    </p>
                  </div>
                  {/* 보유한 토큰 리스트 */}
                  {myAsset.map((v, i) => {
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
                    );
                  })}
                </>
              ) : (
                // 클릭하면 드롭다운 닫기
                <>
                  <span className="modal-dropdown" onClick={onClickSelectAsset}>
                    {currentBalance} {currentTicker}
                    <HiSelector />
                  </span>
                </>
              )}
              <input
                type="text"
                onChange={(e) => setValue(e.target.value)}
                className="modal-inputbox p-2 dm-sans text-sm"
                placeholder="Enter amount"
              ></input>
            </div>
          </div>

          {/* 예상가스비 */}
          <div className="w-96 h-28 bg-teal-100 rounded-lg border border-purple-950 mt-8">
            <div className="dm-sans-title-reveal text-lg text-center py-3 text-green-800">
              Estimated Gas Fee
            </div>
            <ul className="text-center dm-sans-modal-info text-sm">
              <div className="flex flex-row justify-between mx-4">
                <div className="text-left font-semibold">
                  <li>Estimated Fee</li>
                  <li>Market -30 sec</li>
                </div>
                <div className="text-right">
                  <li>0.00003411 SepholiaETH</li>
                  <li>Max Fee: 0.0003525 SepholiaETH</li>
                </div>
              </div>
            </ul>
          </div>

          {/* Send버튼 */}
          <input type="submit" value="Send" className="modal-button mt-8" />
        </form>
      </div>
    </div>
  );
};
export default Send;
