import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { AuthContext } from "./Auth";

export const ImportTokenForm = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [ticker, setTicker] = useState();
  // 이전코드 const [api, setApi] = useState();
  // 이전코드const [apiKey, setApiKey] = useState();
  const [balance, setBalance] = useState([]);

  const {
    currentProvider,
    currentNetwork,
    currentAccount,
    setImportOpen,
    importOpen,
  } = useOutletContext();

  const { pw } = useOutletContext(AuthContext);

  const onSubmitImportToken = async (e) => {
    e.preventDefault();

    var api = "";
    var apiKey = "";
    var currentNetwork = "Polygon";
    if (currentNetwork == "Polygon") {
      api = "api.polygonscan.com";
      apiKey = process.env.REACT_APP_POLYGONSCAN_API_KEY;
      // 이전코드 setApi("api.polygonscan.com");
      // 이전코드 setApiKey(process.env.REACT_APP_POLYGONSCAN_API_KEY);
    } else if (currentNetwork == "Ethereum") {
      api = "api.etherscan.io";
      apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
      // 이전코드 setApi("api.etherscan.io");
      // 이전코드 setApiKey(process.env.REACT_APP_ETHERSCAN_API_KEY);
    } else if (currentNetwork == "Arbitrum") {
      api = "api.arbiscan.io";
      apiKey = process.env.REACT_APP_ARBISCAN_API_KEY;
      // 이전코드 setApi("api.arbiscan.io");
      // 이전코드 setApiKey(process.env.REACT_APP_ARBISCAN_API_KEY);
    } else if (currentNetwork == "Optimism") {
      api = "api-optimistic.etherscan.io";
      apiKey = process.env.REACT_APP_OPTIMISMSCAN_API_KEY;
      // 이전코드 setApi("api-optimistic.etherscan.io");
      // 이전코드 setApiKey(process.env.REACT_APP_OPTIMISMSCAN_API_KEY);
    }

    if (!api || !tokenAddress) {
      alert("Please try to import again");
      return;
    }
    try {
      const encryptedJson = localStorage.getItem("dexwalletData");
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, pw);
      const signer = new ethers.Wallet(wallet.privateKey, currentProvider);

      const response = await axios.get(
        `https://${api}/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${apiKey}`
      );

      var abi = JSON.parse(response.data.result);

      if (abi != "") {
        const contract = new ethers.Contract(tokenAddress, abi, signer);
        const result = await contract.balanceOf(currentAccount);
        var tick = await contract.symbol();
        // v6 : ethers.formatEther(String(result))
        // v5
        const value = ethers.utils.formatEther(String(result));
        setTicker(tick);
        setBalance([
          ...balance,
          { ticker: tick, value: Number(value), address: tokenAddress },
        ]);

        alert("Importing Success");
        setImportOpen(!importOpen);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const jsonArray = JSON.stringify(balance);
    localStorage.setItem(currentNetwork, jsonArray);
  }, [balance]);

  return (
    <>
      {/* 토큰 임포트 정보 입력란 */}
      <form
        onSubmit={onSubmitImportToken}
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
              onChange={(e) => setTokenAddress(e.target.value)}
              className="modal-inputbox p-2 dm-sans text-sm"
              placeholder="Enter token contract address"
            ></input>
            <input
              type="text"
              value={ticker}
              className="modal-inputbox p-2 dm-sans text-sm"
              placeholder="Enter ticker"
            ></input>
          </div>
        </div>

        {/* Import버튼 */}
        <input type="submit" value="Import" className="modal-button mt-8" />
      </form>
    </>
  );
};
