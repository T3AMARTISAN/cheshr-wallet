import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Send = () => {
  const [value, setValue] = useState();
  const [toAddress, setToAddress] = useState();
  const [receipt, setReceipt] = useState([]);

  const { password, currentProvider, balance, unit } = useOutletContext();

  const onSubmitSend = (e) => {
    e.preventDefault();
    async function Send() {
      try {
        const encryptedJson = localStorage.getItem("dexwalletData");
        const wallet = await ethers.decryptKeystoreJson(
          encryptedJson,
          password
        );
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
            chainId: Number(result.chainId),
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    }
    Send();
  };
  useEffect(() => {
    const jsonArray = JSON.stringify(receipt);
    localStorage.setItem("history", jsonArray);
  }, [receipt]);
  return (
    <div className="container overflow-y-auto bg-blue-100">
      <form onSubmit={onSubmitSend}>
        <h3>잔액</h3>
        <ul>
          {balance} {unit}
        </ul>
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
