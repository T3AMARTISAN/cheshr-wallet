import { useOutletContext } from "react-router-dom";
import Ethereum from "./Networks/Ethereum";
import Polygon from "./Networks/Polygon";
import Optimism from "./Networks/Optimism";
import Arbitrum from "./Networks/Arbitrum";
import Sepolia from "./Networks/Sepolia";
import Goerli from "./Networks/Goerli";
import { useState } from "react";
import { SlClose } from "react-icons/sl";

const NetworkSwitch = () => {
  const { currentNetwork, setCurrentProvider } = useOutletContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const onClickLinea = () => {
    setCurrentProvider();
  };

  const onClickAvalanche = () => {
    setCurrentProvider();
  };

  return (
    <div className="relative mt-2">
      <button
        className={`toggle-dropdown mx-0 w-44 focus:outline-none text-sm text-center ${
          isOpen && "rounded-b-none"
        }`}
        onClick={toggleDropdown}
      >
        <span className="h-3 w-3 rounded-full bg-green-400 text-center"></span>
        <span>Network: {currentNetwork}</span>
      </button>
      {isOpen && (
        <div className="z-20 absolute w-44 border border-purple-800 bg-white rounded-b-lg shadow-xl">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="dm-sans-token-info text-lg text-center">
              MAIN NETWORK
            </div>
            <Ethereum />
            <Polygon />
            {/*
        <button
          className="border rounded-lg border-black py-1 pl-1 mr-1"
          onClick={onClickLinea}
        >
          Linea Mainnet
        </button>
        */}
            <Optimism />
            <Arbitrum />
            {/*
        <button
          className="border rounded-lg border-black py-1 pl-1 mr-1"
          onClick={onClickAvalanche}
        >
          Avalanche C-Chain
        </button>
        */}
            <div className="dm-sans-token-info text-lg pt-2 text-center">
              TEST NETWORK
            </div>
            <Sepolia />
            <Goerli />
            <button className="my-4 text-center" onClick={toggleDropdown}>
              <SlClose className="text-base" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSwitch;
