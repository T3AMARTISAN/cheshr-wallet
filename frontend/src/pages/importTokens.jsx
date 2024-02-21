import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";

const ImportTokens = () => {
  const [tokenAddress, setTokenAddress] = useState();
  const [ticker, setTicker] = useState();
  const [api, setApi] = useState();
  const [apiKey, setApiKey] = useState();
  const [balance, setBalance] = useState([]);

  const { password, currentProvider, currentNetwork, currentAccount } =
    useOutletContext();

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
      const wallet = await ethers.decryptKeystoreJson(encryptedJson, password);
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
    <div className="container overflow-y-auto bg-blue-100">
      <form onSubmit={onSubmitImportToken}>
        <h3>Token Address</h3>
        <input type="text" onChange={(e) => setTokenAddress(e.target.value)} />
        <h3>Ticker</h3>
        <input type="text" value={ticker} />
        <input type="submit" value="Import" />
      </form>
    </div>
  );
};

export default ImportTokens;
