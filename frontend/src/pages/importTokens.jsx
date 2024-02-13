import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";

const ImportTokens = () => {
  const [tokenAddress, setTokenAddress] = useState();
  const [ticker, setTicker] = useState();
  const [api, setApi] = useState();
  const [balance, setBalance] = useState([]);

  const { password, currentProvider } = useOutletContext();

  const onSubmitImportToken = async (e) => {
    e.preventDefault();

    try {
      const encryptedJson = localStorage.getItem("data");
      const wallet = await ethers.decryptKeystoreJson(encryptedJson, password);
      const signer = new ethers.Wallet(wallet.privateKey, currentProvider);
      const network = await currentProvider.getNetwork();
      const chain = network.chainId;
      if (Number(chain) == 137) {
        setApi("polygonscan.com");
      } else {
        setApi("etherscan.io");
      }

      const response = await axios.get(
        `https://api.${api}/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.REACT_APP_POLYGONSCAN_API_KEY}``https://api.etherscan.io/api?module=contract&action=getabi&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken`
      );

      var abi = JSON.parse(response.data.result);

      if (abi != "") {
        const contract = new ethers.Contract(tokenAddress, abi, signer);
        const result = await contract.balanceOf(
          "0x6c25cf6B6F2635dB80e32bB31e6E6131d3042382"
        );
        setTicker(await contract.symbol());
        const value = ethers.formatEther(String(result));
        setBalance([...balance, { ticker: ticker, value: Number(value) }]);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const jsonArray = JSON.stringify(balance);
    localStorage.setItem("tokenData", jsonArray);
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
