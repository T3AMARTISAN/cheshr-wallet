import { useOutletContext } from "react-router-dom";
import Ethereum from "./Networks/Ethereum";
import Polygon from "./Networks/Polygon";
import Optimism from "./Networks/Optimism";
import Arbitrum from "./Networks/Arbitrum";
import Sepolia from "./Networks/Sepolia";
import Goerli from "./Networks/Goerli";

const NetworkSwitch = () => {
  const { setIsNetworkButtonClick, setCurrentProvider } = useOutletContext();

  const onClickClose = () => {
    setIsNetworkButtonClick(false);
  };

  const onClickLinea = () => {
    setCurrentProvider();
  };

  const onClickAvalanche = () => {
    setCurrentProvider();
  };

  return (
    <div className="sticky top-16 bg-white h-[480px] rounded-lg">
      <div className="h-3/5 flex flex-col justify-center pl-3 gap-2">
        <div>Main Network</div>
        <Ethereum />
        <Polygon />
        <button
          className="border rounded-lg border-black py-1 pl-1 mr-1"
          onClick={onClickLinea}
        >
          Linea Mainnet
        </button>
        <Optimism />
        <Arbitrum />
        <button
          className="border rounded-lg border-black py-1 pl-1 mr-1"
          onClick={onClickAvalanche}
        >
          Avalanche C-Chain
        </button>
      </div>
      <div className="bg-blue-100 h-2/5 flex flex-col justify-center pl-3 gap-2">
        <div>Test Network</div>
        <Sepolia />
        <Goerli />
        <button className="mt-2" onClick={onClickClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default NetworkSwitch;
