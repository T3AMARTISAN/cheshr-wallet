import { ethers } from "ethers";
import { useContext, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthContext } from "./Auth";
import CopyButton from "../components/Buttons/CopyButton";

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
  const { setPw } = useContext(AuthContext);
  const [phrase, setPhrase] = useState();
  const [pvk, setPvk] = useState();
  // State to manage the checkboxes
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const navigate = useNavigate();

  const copyAddress = () => {
    navigator.clipboard.writeText(currentAccount);
  };

  const copyPhrase = () => {
    navigator.clipboard.writeText(phrase);
  };

  const copyPvk = () => {
    navigator.clipboard.writeText(pvk);
  };

  const passwordReset = () => {
    setPassword("");
    setConfirmPassword("");
    setPasswordValid(false);
    setPasswordsMatch(false);
  };

  const onClickOK = () => {
    setPw(confirmPassword);
    passwordReset();
    navigate("/feed");
  };

  const createWallet = async () => {
    // Store wallet data
    const newEOA = ethers.Wallet.createRandom();
    const encryptedJSON = await newEOA.encrypt(confirmPassword);
    localStorage.setItem("dexwalletData", encryptedJSON);
    setCurrentAccount(newEOA.address);
    setPhrase(newEOA.mnemonic.phrase);
    setPvk(newEOA.privateKey);
  };

  // Handler to toggle the first checkbox
  const handleCheckboxChange1 = (e) => {
    setIsChecked1(e.target.checked);
  };

  // Handler to toggle the second checkbox
  const handleCheckboxChange2 = (e) => {
    setIsChecked2(e.target.checked);
  };

  return (
    <>
      <div className="pt-28 mt-4 flex flex-col px-6 h-fit">
        {!currentAccount ? (
          <>
            <div className="text-lg text-center mb-4 whitespace-pre-line">
              {`Let the magic begin 🎩
            Make sure nobody is watching!`}
            </div>
            {/* 입력한 비밀번호로 지갑주소 생성 */}
            <button
              className={
                !currentAccount ? "revealButton mx-auto mt-6" : "hidden"
              }
              disabled={currentAccount}
              onClick={createWallet}
            >
              Reveal Wallet Address
            </button>
          </>
        ) : (
          <>
            {/* 버튼 클릭 후 계정 생성 성공 시 정보 표시 */}
            <div className="text-lg text-center mb-12 whitespace-pre-line">
              {`✨Your address is ready!✨`}
            </div>
            {currentAccount && (
              <>
                <div className="revealBox flex flex-col gap-6 mb-10 items-start">
                  <div>
                    <div className="flex flex-row gap-1 pt-2">
                      <div className="dm-sans-title-reveal">Wallet Address</div>
                      <button onClick={copyAddress}>
                        <CopyButton />
                      </button>
                    </div>
                    <div className="dm-sans-body-reveal break-all">
                      {currentAccount && `${currentAccount}`}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row gap-1">
                      <div className="dm-sans-title-reveal">Seed Phrase</div>
                      <button onClick={copyPhrase}>
                        <CopyButton />
                      </button>
                    </div>
                    <div className="dm-sans-body-reveal break-words">
                      {currentAccount && `${phrase}`}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row gap-1">
                      <div className="dm-sans-title-reveal">Private Key</div>
                      <button onClick={copyPvk}>
                        <CopyButton />
                      </button>
                    </div>
                    <div className="flex flex-row gap-1">
                      <div className="dm-sans-body-reveal break-all pb-2">
                        {currentAccount && `${pvk}`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex mb-10 flex-col gap-2 font-light text-md whitespace-pre px-6 text-center">
                  <div className="flex flex-row gap-1 items-center">
                    <div className="consentBox">
                      I will not share my seed phrase and private key.
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked1}
                      onChange={handleCheckboxChange1}
                      className="form-checkbox"
                    />
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <div className="consentBox">
                      cheshr cannot recover my password.
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked2}
                      onChange={handleCheckboxChange2}
                      className="form-checkbox"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-around px-20">
                  <button
                    className={`${
                      isChecked1 && isChecked2
                        ? "homepageButton"
                        : "homepageButton-inactive"
                    }`}
                    onClick={onClickOK}
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NewWallet;
