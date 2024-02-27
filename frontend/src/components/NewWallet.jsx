import { ethers } from "ethers";
import { useContext, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthContext } from "./Auth";
import CopyButton from "../components/Buttons/CopyButton";
import LoadingSpinner from "./LoadingSpinner";

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
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

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
    setLoading(true);
    setPw(confirmPassword);
    passwordReset();
    setLoading(false);
    navigate("/feed");
  };

  const createWallet = async () => {
    // Store wallet data
    setCreating(true);
    const newEOA = ethers.Wallet.createRandom();
    const encryptedJSON = await newEOA.encrypt(confirmPassword);
    localStorage.setItem("dexwalletData", encryptedJSON);
    setCurrentAccount(newEOA.address);
    setPhrase(newEOA.mnemonic.phrase);
    setPvk(newEOA.privateKey);
    setCreating(false);
  };

  // Handler to toggle the first checkbox
  const handleCheckboxChange1 = (e) => {
    setIsChecked1(e.target.checked);
  };

  // Handler to toggle the second checkbox
  const handleCheckboxChange2 = (e) => {
    setIsChecked2(e.target.checked);
  };

  if (loading) {
    return (
      <div className="pt-12 px-6 h-fit">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="pt-28 mt-2 flex flex-col px-6 h-fit">
        {!currentAccount ? (
          <>
            <div className="text-lg text-center mb-4 whitespace-pre-line text-purple-50 shadow-yellow-200">
              {`Let the magic begin 🎩
            Make sure nobody is watching!`}
            </div>
            {/* 입력한 비밀번호로 지갑주소 생성 */}
            {!creating ? (
              <button
                className={
                  !currentAccount ? "revealButton mx-auto mt-6" : "hidden"
                }
                disabled={currentAccount}
                onClick={createWallet}
              >
                Reveal Wallet Address
              </button>
            ) : (
              <LoadingSpinner />
            )}
          </>
        ) : (
          <>
            {/* 버튼 클릭 후 계정 생성 성공 시 정보 표시 */}
            <div className="text-lg text-center mb-4 whitespace-pre-line text-purple-50">
              {`✨Your address is ready!✨`}
            </div>
            {currentAccount && (
              <>
                <div className="revealBox flex flex-col gap-6 mb-6 items-start">
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

                <div className="flex mb-4 flex-col gap-2 font-light text-md whitespace-pre px-6 text-center">
                  <div className="flex flex-row gap-1 items-center">
                    <div className="consentBox text-sm">
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
                    <div className="consentBox text-sm">
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
                        ? "homepageButton-rounded w-28 bg-[#7766aa]"
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
