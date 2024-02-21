import { useState, useContext, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import BurgerButton from "../components/Buttons/BurgerButton";
import { AuthContext } from "./Auth";

const WalletDropdown = () => {
  const { setLocked, pw, setPw } = useContext(AuthContext);
  const { currentAccount, setCurrentAccount } = useOutletContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const decrypt = async () => {
    try {
      const encryptedJson = localStorage.getItem("dexwalletData");
      return await ethers.Wallet.fromEncryptedJson(encryptedJson, pw);
    } catch (error) {
      console.error(error);
    }
  };

  const getAddress = async () => {
    try {
      const wallet = await decrypt();
      setCurrentAccount(wallet.address);
    } catch (error) {
      console.error(error);
    }
  };

  const onCopyAddress = () => {
    navigator.clipboard.writeText(currentAccount);
    toggleDropdown();
  };

  const onClickLogout = () => {
    setPw("");
    setCurrentAccount("");
    setLocked(true);
    navigate("/");
  };

  useEffect(() => {
    getAddress();
  }, [currentAccount]);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`toggle-dropdown focus:outline-none inset-x-0 ${
          isOpen && "rounded-b-none"
        }`}
      >
        <div className="dm-sans flex flex-row gap-3 justify-center">
          {currentAccount.substring(0, 5)}...
          {currentAccount.substring(currentAccount.length - 4)}
          <BurgerButton />
        </div>
      </button>

      {isOpen && (
        <div className="z-20 absolute mx-4 w-36 border border-purple-800 bg-white rounded-b-lg shadow-xl">
          <div className="toggle-menu text-sm">QR Code</div>
          <div className="toggle-menu text-sm" onClick={onCopyAddress}>
            Copy Wallet
          </div>
          <div className="toggle-menu text-sm" onClick={onClickLogout}>
            Lock Wallet
          </div>
          {/*@TODO*/}
          <div className="toggle-menu text-sm border border-t-1 border-t-purple-900 border-b-0">
            🔑 Seed Phrase
          </div>
          <div className="toggle-menu text-sm hover:rounded-b-lg ">
            🔑 Private Key
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDropdown;
