import { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import MyOwnAsset from "../components/MyOwnAsset";
import axios from "axios";
import BackButton from "../components/Buttons/BackButton";
import { AuthContext } from "../components/Auth";
import { HiSelector } from "react-icons/hi";

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

  const { currentProvider, currentNetwork, balance, unit, currentAccount } =
    useOutletContext();
  const { pw } = useContext(AuthContext);

  const navigate = useNavigate();

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
    navigate(-1);
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
        <div className="dm-sans-title-feed pb-4 text-center">SEND</div>

        {/* 트랜잭션 정보 입력란 */}
        <form
          onSubmit={onSubmitSend}
          className="flex flex-col gap-2 justify-center items-center"
        >
          <div className="flex flex-col justify-center items-end gap-3">
            {/* 보내는 주소 */}
            <div className="flex flex-row gap-2">
              <div className="dm-sans-title-dashboard bg-lime-200">TO</div>
              <input
                type="text"
                onChange={(e) => setToAddress(e.target.value)}
                className="modal-inputbox"
              ></input>
            </div>
            {/* 토큰 선택 */}
            <div className="flex flex-row gap-2 items-center">
              <div className="dm-sans-title-dashboard bg-lime-200">ASSET</div>
              {isClick ? (
                <div className="flex flex-col">
                  {/* 클릭하면 보유한 토큰 보여주기 */}
                  <div
                    className={`modal-dropdown ${
                      isClick && "rounded-b-none border-b-0"
                    }`}
                    onClick={onClickSelectAsset}
                  >
                    {currentBalance} {currentTicker}
                    <HiSelector />
                  </div>
                  <div
                    className={`modal-dropdown ${
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
                </div>
              ) : (
                // 클릭하면 드롭다운 닫기
                <>
                  <span className="modal-dropdown" onClick={onClickSelectAsset}>
                    {currentBalance} {currentTicker}
                    <HiSelector />
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-row gap-2">
              <div className="dm-sans-title-dashboard gap-2 bg-lime-200">
                AMOUNT
              </div>
              <input
                type="text"
                onChange={(e) => setValue(e.target.value)}
                className="modal-inputbox"
              ></input>
            </div>

            <div className="w-72 h-32 bg-teal-100 border border-purple-950">
              <div className="dm-sans-body-reveal text-xl text-center my-2">
                Estimated Gas Fee
              </div>
            </div>
          </div>

          <input type="submit" value="Send" className="modal-button mt-10" />
        </form>
      </div>
    </div>
  );
};
export default Send;
