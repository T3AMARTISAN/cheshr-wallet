import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import BackButton from "./Buttons/BackButton";
import { AuthContext } from "./Auth";
import ImportToggleButton from "./Buttons/ImportToggleButton";
import { ImportTokenForm } from "./ImportTokenForm";
import { ImportLPForm } from "../ImportLPForm";

const Import = () => {
  const [value, setValue] = useState();
  const [toAddress, setToAddress] = useState();
  const [receipt, setReceipt] = useState([]);
  const [myAsset, setMyAsset] = useState([]);
  const [currentBalance, setCurrentBalance] = useState();
  const [currentTicker, setCurrentTicker] = useState();
  const [currentTokenAddress, setCurrentTokenAddress] = useState();
  const [api, setApi] = useState();
  const [apiKey, setApiKey] = useState();
  const [isErc, setIsErc] = useState(false);
  const [isToggled, setIsToggled] = useState(false);

  const {
    currentProvider,
    currentNetwork,
    balance,
    unit,
    currentAccount,
    importOpen,
    setImportOpen,
  } = useOutletContext();
  const { pw } = useContext(AuthContext);

  const onSubmitSend = (e) => {
    e.preventDefault();
    if (!isErc) {
      async function Send() {
        try {
          const encryptedJson = localStorage.getItem("dexwalletData");
          const wallet = await ethers.Wallet.fromEncryptedJson(
            encryptedJson,
            pw
          );
          const signer = new ethers.Wallet(wallet.privateKey, currentProvider);
          const tx = {
            to: toAddress,
            // v6 : ethers.parseUnits(value, "ether")
            // v5
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
          // v6 : await ethers.decryptKeystoreJson(encryptedJson, pw)
          // v5
          const wallet = await ethers.Wallet.fromEncryptedJson(
            encryptedJson,
            pw
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

  const onClickBack = () => {
    setImportOpen(!importOpen);
  };

  return (
    <div className="modal-bg radial-bg-home">
      <div className="dm-sans container-modal lp-card">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onClickBack}
          className="-translate-x-12 translate-y-8 "
        >
          <BackButton />
        </button>

        {/* 헤더 */}
        <div className="dm-sans text-white text-4xl py-4 text-center">
          IMPORT
        </div>
        <div className="dm-sans text-white whitespace-pre-line text-center leading-6 text-lg pb-8">{`Don't see your assets here?
          Import them to cheshr!`}</div>

        {/* 토글 */}
        <ImportToggleButton isToggled={isToggled} setIsToggled={setIsToggled} />

        {isToggled ? <ImportLPForm /> : <ImportTokenForm />}
      </div>
    </div>
  );
};
export default Import;
