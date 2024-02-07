import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Send = () => {
  const [value, setValue] = useState();
  const [toAddress, setToAddress] = useState();

  const { password, currentProvider, balance, unit } = useOutletContext();

  const navigate = useNavigate();

  const onSubmitSend = (e) => {
    e.preventDefault();
    async function Send() {
      console.log(value);
      console.log(toAddress);
      try {
        const encryptedJson = localStorage.getItem("data");
        const wallet = await ethers.decryptKeystoreJson(
          encryptedJson,
          password
        );
        const signer = new ethers.Wallet(wallet.privateKey, currentProvider);
        const tx = {
          to: toAddress,
          value: ethers.parseUnits(value, "ether"),
        };
        await signer.sendTransaction(tx);
      } catch (error) {
        console.error(error);
      }
    }
    Send();
    navigate("/main");
  };
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