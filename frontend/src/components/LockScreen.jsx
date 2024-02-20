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
    <div className="pt-28 mt-12 flex flex-col px-6 h-fit">
      <div className="flex flex-col justify-center dm-sans-body">
        <div className="whitespace-pre-line text-center leading-6 text-lg pb-10">{`Welcome back!
          Enter your password`}</div>
        <input
          className="relative inputbox w-96 mx-auto mb-8"
          type="password"
          onChange={handlePasswordChange}
          placeholder="Enter password"
        />
        {wrongPassword && (
          <p className="invalid-text">
            {`Invalid password. Please try again.`}
          </p>
        )}
        <div className="flex flex-col items-center">
          <div className="flex flex-row gap-8 justify-around">
            <button
              className={`${
                !unlockPassword ? "homepageButton-inactive" : "homepageButton"
              }`}
              disabled={!unlockPassword}
              onClick={onClickConfirm}
            >
              Confirm
            </button>
            <button className="homepageButton" onClick={onClickReset}>
              Wallet Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
