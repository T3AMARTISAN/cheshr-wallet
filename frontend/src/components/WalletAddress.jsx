import { useContext, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import { FaRegCopy } from "react-icons/fa";
import LockButton from "./Buttons/LockButton";
import NetworkButton from "./NetworkButton";
import { AuthContext } from "./Auth";

const WalletAddress = () => {
  const { pw } = useContext(AuthContext);
  const { currentAccount, setCurrentAccount } = useOutletContext();

  const copyPhrase = () => {
    navigator.clipboard.writeText(currentAccount);
  };

  const getWallet = async () => {
    try {
      const encryptedJson = localStorage.getItem("dexwalletData");
      if (!encryptedJson) {
        throw new Error("Encrypted JSON not found in local storage");
      }

      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, pw);
      setCurrentAccount(wallet.address);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWallet();
  }, [pw]);

  return (
    <div className="h-16 bg-neutral-300 rounded-t-xl mt-1 flex flex-row justify-center gap-16 items-center">
      <NetworkButton />
      <div className="flex flex-row justify-center items-center gap-2 rounded-md border border-neutral-700 px-4 w-fit">
        {currentAccount.substring(0, 5)}...
        {currentAccount.substring(currentAccount.length - 4)}
        <button onClick={copyPhrase}>
          <FaRegCopy />
        </button>
      </div>
      <LockButton />
    </div>
  );
};

export default WalletAddress;
