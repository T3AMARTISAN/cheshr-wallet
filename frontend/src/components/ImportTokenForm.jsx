import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";
import { AuthContext } from "./Auth";

export const ImportTokenForm = () => {
  const [tokenAddress, setTokenAddress] = useState();
  const [ticker, setTicker] = useState();
  const [api, setApi] = useState();
  const [apiKey, setApiKey] = useState();
  const [balance, setBalance] = useState([]);

  const { currentProvider, currentNetwork, currentAccount } =
    useOutletContext();

  const { pw } = useOutletContext(AuthContext);

  const onSubmitImportToken = async (e) => {
    e.preventDefault();

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
        `https://${api}/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${apiKey}`
      );

      var abi = JSON.parse(response.data.result);

      if (abi != "") {
        const contract = new ethers.Contract(tokenAddress, abi, signer);
        const result = await contract.balanceOf(currentAccount);
        setTicker(await contract.symbol());
        const value = ethers.formatEther(String(result));
        setBalance([
          ...balance,
          { ticker: ticker, value: Number(value), address: tokenAddress },
        ]);
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
