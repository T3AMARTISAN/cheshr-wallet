import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Optimism = () => {
  const { setIsNetworkButtonClick, setCurrentProvider, setCurrentNetwork } =
    useOutletContext();

  const onClickOptimism = () => {
    setCurrentProvider(
      new ethers.InfuraProvider("optimism", process.env.INFURA_API_KEY)
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Optimism");
  };
  return (
    <button
      className="border rounded-lg border-black py-1 pl-1 mr-1"
      onClick={onClickOptimism}
    >
      Optimism Mainnet
    </button>
  );
};

export default Optimism;
