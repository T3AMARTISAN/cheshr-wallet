import { ethers } from "ethers";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaRegCopy } from "react-icons/fa";
import EOASecret from "./EOASecret";

const NewWallet = () => {
  const {
    currentAccount,
    setCurrentAccount,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    setPasswordValid,
    setPasswordsMatch,
    setPasswordButtonClicked,
  } = useOutletContext();
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  const passwordReset = () => {
    setPassword("");
    setConfirmPassword("");
    setPasswordValid(false);
    setPasswordsMatch(false);
  };

  const onClickBack = () => {
    passwordReset();
    setPasswordButtonClicked(0);
  };

  const onClickOK = () => {
    passwordReset();
    navigate("/feed");
  };

  const onClickAgree = () => {
    setConsent(true);
  };

  const createWallet = async () => {
    // Store wallet data
    const newEOA = ethers.Wallet.createRandom();
    const encryptedJSON = await newEOA.encrypt(confirmPassword);
    localStorage.setItem("dexwalletData", encryptedJSON);
    setCurrentAccount(newEOA.address);
  };

  const copyWallet = () => {
    navigator.clipboard.writeText(currentAccount);
  };

  return (
    <div className="container overflow-y-auto">
      <div className="bg-blue-100 text-center text-2xl p-2 mb-6">
        create new wallet
      </div>
      <div className="bg-green-100 h-5/6 mb-6">
        <div className="text-lg text-center pt-4">
          ✨ Your wallet address is ready ✨
        </div>
        <div className="flex flex-row gap-1 justify-center items-center p-5">
          <button
            className="flex bg-green-300 p-2 rounded-md"
            disabled={currentAccount}
            onClick={createWallet}
          >
            {!currentAccount ? "Reveal Wallet Address" : `${currentAccount}`}
          </button>
          <button
            onClick={copyWallet}
            className={`${currentAccount ? "block" : "hidden"}`}
          >
            <FaRegCopy />
          </button>
        </div>
        {currentAccount ? (
          <>
            <EOASecret />
            <div className="flex flex-col items-center gap-2 font-light text-md whitespace-pre px-6 text-center">
              <div>
                {`Make sure not to share this information with anybody!\nYour private key is the access your wallet.\nYou are responsible to keep it extra safe!`}
              </div>
              <button
                className="bg-yellow-300 py-1 px-2 w-fit rounded-md text-center"
                onClick={onClickAgree}
              >
                I understand
              </button>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-row justify-around px-20">
        <button
          className={`rounded-md p-2 px-4 ${
            currentAccount
              ? "bg-neutral-500 cursor-not-allowed"
              : "bg-purple-100"
          }`}
          disabled={currentAccount}
          onClick={onClickBack}
        >
          Back
        </button>
        <button
          className={`rounded-md p-2 px-4 ${
            !consent ? "bg-neutral-500 cursor-not-allowed" : "bg-purple-100"
          }`}
          onClick={onClickOK}
          disabled={!consent || !currentAccount}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default NewWallet;
