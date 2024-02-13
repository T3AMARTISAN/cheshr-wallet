import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const EOASecret = () => {
  const { currentAccount, confirmPassword } = useOutletContext();
  const [phrase, setPhrase] = useState();
  const [pvk, setPvk] = useState();

  const copyPhrase = () => {
    navigator.clipboard.writeText(phrase);
  };

  const copyPvk = () => {
    navigator.clipboard.writeText(pvk);
  };

  useEffect(() => {
    async function getSecrets() {
      try {
        const encryptedJson = localStorage.getItem("dexwalletData");
        if (!encryptedJson) {
          throw new Error("Encrypted JSON not found in local storage");
        }

        const wallet = await ethers.Wallet.fromEncryptedJson(
          encryptedJson,
          confirmPassword
        );

        setPhrase(wallet.mnemonic.phrase);
        setPvk(wallet.privateKey);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    getSecrets();
  }, [currentAccount]);

  return (
    <>
      <div className="text-lg text-center pt-4">🌱 Seed Phrase</div>
      <div className="flex flex-row gap-1 p-4">
        <div className="bg-green-300 p-10 w-full rounded-md text-center">
          {currentAccount ? phrase : ""}
        </div>
        <button onClick={copyPhrase}>
          <FaRegCopy />
        </button>
      </div>
      <div className="text-lg text-center pt-4">🔐 Private Key</div>
      <div className="flex flex-row gap-1 p-6">
        <div className="bg-green-300 text-sm p-2 w-full rounded-md break-words text-center">
          {currentAccount ? pvk : ""}
        </div>
        <button onClick={copyPvk}>
          <FaRegCopy />
        </button>
      </div>
    </>
  );
};

export default EOASecret;
