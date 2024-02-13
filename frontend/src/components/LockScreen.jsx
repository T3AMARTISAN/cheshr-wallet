import { ethers } from "ethers";
import { useContext, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthContext } from "./Auth";

const LockScreen = () => {
  const [unlockPassword, setUnlockPassword] = useState();
  const { currentAccount } = useOutletContext();
  const { setLocked } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setUnlockPassword(newPassword);
  };

  const decodeJson = async (pw) => {
    const walletData = localStorage.getItem("dexwalletData");
    const wallet = await ethers.Wallet.fromEncryptedJson(walletData, pw);
    return wallet.address !== currentAccount;
  };

  const onClickConfirm = () => {
    const authorized = decodeJson(unlockPassword);
    if (authorized) {
      setLocked(false);
      navigate("/feed");
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
            className="rounded-md p-1"
            type="password"
            value={unlockPassword}
            onChange={handlePasswordChange}
            placeholder="Enter password to unlock wallet..."
          />
          <div className="flex flex-row justify-around">
            <button
              className={`rounded-md p-2 ${
                !unlockPassword
                  ? "bg-neutral-500 cursor-not-allowed"
                  : "bg-purple-100"
              }`}
              disabled={!unlockPassword}
              onClick={onClickConfirm}
            >
              Confirm
            </button>
            <button>Reset Wallet</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
