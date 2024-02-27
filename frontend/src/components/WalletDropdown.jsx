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
        className={`wallet-dropdown bg-purple-50 z-20 focus:outline-none inset-x-0 ${
          isOpen && "rounded-b-none shadow-none drop-shadow-none mb-0"
        }`}
      >
        <div className="dm-sans font-normal flex flex-row gap-3 justify-center">
          {currentAccount.substring(0, 5)}...
          {currentAccount.substring(currentAccount.length - 4)}
          <BurgerButton />
        </div>
      </button>

      {isOpen && (
        <div className="z-10 absolute bg-purple-50 mx-4 w-36 mt-0 rounded-b-lg shadow drop-shadow-xl">
          <div className="toggle-menu text-black text-sm">QR Code</div>
          <div
            className="toggle-menu text-black text-sm"
            onClick={onCopyAddress}
          >
            Copy Wallet
          </div>
          <div
            className="toggle-menu text-black text-sm"
            onClick={onClickLogout}
          >
            Lock Wallet
          </div>
          {/*@TODO*/}
          <div className="toggle-menu text-black  text-sm ">🔑 Seed Phrase</div>
          <div className="toggle-menu text-black  text-sm hover:rounded-b-lg ">
            🔑 Private Key
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDropdown;
