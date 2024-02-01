import { useOutletContext } from "react-router-dom";

const NetworkSwitch = () => {
  const { setIsNetworkButtonClick } = useOutletContext();

  const onClickClose = () => {
    setIsNetworkButtonClick(false);
  };

  return (
    <div className="bg-white absolute w-full h-[480px]">
      <div className="bg-red-100 h-3/5 flex flex-col justify-center pl-3 gap-2">
        <div>Main Network</div>
        <div className="border rounded-lg border-black py-1 px-1 mr-1">
          Ethereum Mainnet
        </div>
        <div className="border rounded-lg border-black py-1 pl-1 mr-1">
          Polygon Mainnet
        </div>
        <div className="border rounded-lg border-black py-1 pl-1 mr-1">
          Linea Mainnet
        </div>
        <div className="border rounded-lg border-black py-1 pl-1 mr-1">
          Optimism Mainnet
        </div>
        <div className="border rounded-lg border-black py-1 pl-1 mr-1">
          Arbitrum Mainnet
        </div>
        <div className="border rounded-lg border-black py-1 pl-1 mr-1">
          Avalanche C-Chain
        </div>
      </div>
      <div className="bg-blue-100 h-2/5 flex flex-col justify-center pl-3 gap-2">
        <div>Test Network</div>
        <div className="border rounded-lg border-black py-1 pl-1 mr-1">
          ETH Sepolia Test Network
        </div>
        <div className="border rounded-lg border-black py-1 pl-1 mr-1">
          ETH Sepolia Test Network
        </div>
        <button className="mt-2" onClick={onClickClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default NetworkSwitch;
