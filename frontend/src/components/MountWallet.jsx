import { ethers } from "ethers";
import { useContext, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ToggleButton from "./Buttons/ToggleButton";
import Seed from "./Seed";
import PVKey from "./Key";
import EOAPassword from "./EOAPassword";
import { AuthContext } from "./Auth";

const MountWallet = () => {
  const {
    setCurrentAccount,
    confirmPassword,
    setPassword,
    passwordsMatch,
    setConfirmPassword,
  } = useOutletContext();
  const { setPw } = useContext(AuthContext);
  const [isToggled, setIsToggled] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [pvk, setPvk] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const reset = () => {
    setPhrase("");
    setPvk("");
    setCurrentAccount("");
    setPassword("");
    setConfirmPassword("");
  };

  const onClickOK = async () => {
    await encryptWallet();
    await setPw(confirmPassword);
    reset();
    navigate("/feed");
  };

  const handlePhraseComplete = (_phrase) => {
    setPhrase(_phrase);
  };

  const createWallet = async () => {
    try {
      if (phrase) {
        const newEOA = ethers.Wallet.fromMnemonic(phrase);
        if (!newEOA) throw new Error();
      } else if (pvk) {
        const newEOA = new ethers.Wallet(pvk);
        if (!newEOA) throw new Error();
      }

      setProgress(1);
    } catch (error) {
      console.error(error);
    }
  };

  const encryptWallet = async () => {
    try {
      let newEOA;
      if (phrase) {
        newEOA = ethers.Wallet.fromMnemonic(phrase);
        if (!newEOA) throw new Error();
      } else if (pvk) {
        newEOA = new ethers.Wallet(pvk);
        if (!newEOA) throw new Error();
      }
      const encryptedJSON = await newEOA.encrypt(confirmPassword);
      localStorage.setItem("dexwalletData", encryptedJSON);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {progress == 0 && (
        <div className="pt-28 mt-4 flex flex-col px-6 h-fit">
          <div className="whitespace-pre-line text-center leading-6 text-lg pb-8">{`Let's mount your wallet.
          Click the method you would like to use.`}</div>
          <ToggleButton isToggled={isToggled} setIsToggled={setIsToggled} />
          <div className="py-2 mx-auto text-center">
            {isToggled ? (
              <PVKey pvk={pvk} setPvk={setPvk} />
            ) : (
              <div>
                <Seed onPhraseComplete={handlePhraseComplete} />
              </div>
            )}
            <div className="flex flex-row justify-around px-20 py-10">
              <button
                className={`${
                  phrase || pvk ? "homepageButton" : "homepageButton-inactive"
                }`}
                onClick={createWallet}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {progress == 1 && (
        <>
          <div className="pt-28 mt-4 flex flex-col px-6 h-fit">
            <div className="flex flex-col justify-center dm-sans-body">
              <div className="whitespace-pre-line text-center leading-6 text-lg pb-10">{`Final step!
          What password will you use?`}</div>
              <EOAPassword />
              <div className="flex flex-row justify-around px-20">
                <button
                  className={`rounded-md p-2 px-4 ${
                    !passwordsMatch
                      ? "homepageButton-inactive"
                      : "homepageButton"
                  }`}
                  onClick={onClickOK}
                  disabled={!passwordsMatch}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MountWallet;
