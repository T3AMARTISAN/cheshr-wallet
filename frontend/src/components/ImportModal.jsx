import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import MyOwnAsset from "./MyOwnAsset";
import axios from "axios";
import BackButton from "./Buttons/BackButton";
import { AuthContext } from "./Auth";
import { HiSelector } from "react-icons/hi";
import ImportToggleButton from "./Buttons/ImportToggleButton";

const Import = ({ setImportOpen, importOpen }) => {
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
  const [isToggled, setIsToggled] = useState(false);
  const [mode, setmode] = useState(0);

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

  const onClickBack = () => {
    setImportOpen(!importOpen);
  };

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
        <div className="dm-sans-title-feed py-4 text-center">IMPORT</div>
        <div className="dm-sans- whitespace-pre-line text-center leading-6 text-lg pb-8">{`Don't see your assets here?
          Import them to cheshr!`}</div>

        {/* 토글 */}
        <ImportToggleButton isToggled={isToggled} setIsToggled={setIsToggled} />

        {isToggled ? (
          <>
            {/* LP 컨트랙트 임포트 정보 입력란 */}
            <form
              onSubmit={onSubmitSend}
              className="flex flex-col gap-2 justify-center items-center mt-10"
            >
              <div className="flex flex-row justify-center">
                {/* 항목 */}
                <div className="flex flex-col justify-center items-start gap-5 mx-2">
                  {/* LP 컨트랙트 주소 */}
                  <div className="dm-sans-title-dashboard bg-lime-200 w-24 px-2">
                    LP
                  </div>
                </div>

                {/* 입력란 */}
                <div className="flex flex-col justify-center items-end gap-3">
                  <input
                    type="text"
                    onChange={(e) => setToAddress(e.target.value)}
                    className="modal-inputbox p-2 dm-sans text-sm"
                    placeholder="Enter LP Contract address"
                  ></input>
                </div>
              </div>

              {/* Import버튼 */}
              <input
                type="submit"
                value="Import"
                className="modal-button mt-8"
              />
            </form>
          </>
        ) : (
          <>
            {/* 토큰 임포트 정보 입력란 */}
            <form
              onSubmit={onSubmitSend}
              className="flex flex-col gap-2 justify-center items-center mt-10"
            >
              <div className="flex flex-row justify-center">
                {/* 항목 */}
                <div className="flex flex-col justify-center items-start gap-5 mx-2">
                  {/* LP 컨트랙트 주소 */}
                  <div className="dm-sans-title-dashboard bg-lime-200 w-30 px-2">
                    CONTRACT
                  </div>
                  <div className="dm-sans-title-dashboard bg-lime-200 w-30 px-2">
                    TICKER
                  </div>
                </div>

                {/* 입력란 */}
                <div className="flex flex-col justify-center items-end gap-3">
                  <input
                    type="text"
                    onChange={(e) => setToAddress(e.target.value)}
                    className="modal-inputbox p-2 dm-sans text-sm"
                    placeholder="Enter token contract address"
                  ></input>
                  <input
                    type="text"
                    onChange={(e) => setValue(e.target.value)}
                    className="modal-inputbox p-2 dm-sans text-sm"
                    placeholder="Enter ticker"
                  ></input>
                </div>
              </div>

              {/* Import버튼 */}
              <input
                type="submit"
                value="Import"
                className="modal-button mt-8"
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default Import;
