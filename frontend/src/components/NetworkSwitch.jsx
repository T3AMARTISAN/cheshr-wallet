import { useOutletContext } from "react-router-dom";
import Ethereum from "./Networks/Ethereum";
import Polygon from "./Networks/Polygon";
import Optimism from "./Networks/Optimism";
import Arbitrum from "./Networks/Arbitrum";
import Sepolia from "./Networks/Sepolia";
import Goerli from "./Networks/Goerli";
import { useEffect, useState } from "react";
import { SlClose } from "react-icons/sl";

const NetworkSwitch = () => {
  const { currentNetwork, setCurrentProvider } = useOutletContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // const onClickLinea = () => {
  //   setCurrentProvider();
  //   setIsOpen(!isOpen);
  // };

  // const onClickAvalanche = () => {
  //   setCurrentProvider();
  //   setIsOpen(!isOpen);
  // };

  useEffect(() => {
    console.log(currentNetwork);
  }, [currentNetwork]);

  return (
    <div className="relative -translate-y-2 z-10">
      <button
        className={`toggle-dropdown linear-bg-network mx-0 w-44 focus:outline-none text-sm text-center ${
          isOpen && "rounded-b-none"
        }`}
        onClick={toggleDropdown}
      >
        <span className="h-3 w-3 rounded-full bg-green-400 text-center"></span>
        <span className="p-1">Network: {currentNetwork}</span>
      </button>
      {isOpen && (
        <div className="z-20 absolute w-44 linear-bg-network-dropdown rounded-b-lg shadow-xl">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="text-md text-center text-white font-bold pt-4">
              Main Network
            </div>
            <Ethereum isOpen={isOpen} setIsOpen={setIsOpen} />
            <Polygon isOpen={isOpen} setIsOpen={setIsOpen} />
            {/*
        <button
          className="border rounded-lg border-black py-1 pl-1 mr-1"
          onClick={onClickLinea}
        >
          Linea Mainnet
        </button>
        */}
            <Optimism isOpen={isOpen} setIsOpen={setIsOpen} />
            <Arbitrum isOpen={isOpen} setIsOpen={setIsOpen} />
            {/*
        <button
          className="border rounded-lg border-black py-1 pl-1 mr-1"
          onClick={onClickAvalanche}
        >
          Avalanche C-Chain
        </button>
        */}
            <div className="text-md pt-2 text-center text-white font-bold">
              Test Network
            </div>
            <Sepolia isOpen={isOpen} setIsOpen={setIsOpen} />
            <Goerli isOpen={isOpen} setIsOpen={setIsOpen} />
            <button
              className="my-4 text-center text-white"
              onClick={toggleDropdown}
            >
              <SlClose className="text-base" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSwitch;
