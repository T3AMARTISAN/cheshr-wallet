import { ethers } from "ethers";
import { useContext, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthContext } from "./Auth";

const LockScreen = () => {
  const {
    currentAccount,
    setCurrentAccount,
    setPassword,
    setConfirmPassword,
    setPasswordValid,
    setPasswordsMatch,
  } = useOutletContext();
  const { setLocked, setPw } = useContext(AuthContext);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setUnlockPassword(newPassword);
  };

  const reset = () => {
    setPassword("");
    setUnlockPassword("");
    setConfirmPassword("");
    setPasswordValid(false);
    setPasswordsMatch(false);
    setWrongPassword(false);
  };

  const decodeJson = async (pw) => {
    try {
      const walletData = localStorage.getItem("dexwalletData");
      const wallet = await ethers.Wallet.fromEncryptedJson(walletData, pw);
      setCurrentAccount(wallet.address);
      return currentAccount ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const onClickConfirm = async () => {
    const authorized = await decodeJson(unlockPassword);
    if (authorized) {
      setPw(unlockPassword);
      reset();
      setLocked(false);
      setWrongPassword(false);
      navigate("/feed");
    } else {
      reset();
      setLocked(true);
      setWrongPassword(true);
    }
  };

  const resetWallet = () => {
    localStorage.removeItem("dexwalletData");
    setPw("");
    setWrongPassword(false);
  };

  const onClickReset = async () => {
    reset();
    resetWallet();
    if (!localStorage.getItem("dexwalletData")) {
      window.location.reload();
    }
  };

  return (
    <div className="container items-center bg-green-200">
      {/* network 설정 모달 추가 */}
      {/* {isNetworkButtonClick ? <NetworkSwitch /> : ""} */}
      <div className="bg-yellow-300 top-0 sticky">
        <div className="text-neutral-900 font-extrabold text-4xl py-8 flex justify-center">
          WELCOME BACK
        </div>
      </div>
      <div className="bg-red-300 h-full flex flex-col px-6">
        <div className="flex flex-col gap-6 h-screen justify-center bg-purple-500">
          <input
            className="rounded-md p-3 w-96 mx-auto"
            type="password"
            value={unlockPassword}
            onChange={handlePasswordChange}
            placeholder="Enter password to unlock wallet..."
          />
          <div className="flex flex-col items-center">
            <div className="flex flex-row gap-8 justify-around">
              <button
                className={`rounded-md p-2 w-36 ${
                  !unlockPassword
                    ? "bg-neutral-500 cursor-not-allowed"
                    : "bg-purple-100"
                }`}
                disabled={!unlockPassword}
                onClick={onClickConfirm}
              >
                Confirm
              </button>
              <button
                className="rounded-md p-2 w-36 bg-purple-100"
                onClick={onClickReset}
              >
                Reset Wallet
              </button>
            </div>
            {wrongPassword && (
              <p className="mt-10 text-xs">
                {`Invalid password. Please try again.`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
