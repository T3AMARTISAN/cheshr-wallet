import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Optimism = () => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
    setChainName,
  } = useOutletContext();

  const onClickOptimism = () => {
    setCurrentProvider(
      new ethers.InfuraProvider("optimism", process.env.INFURA_API_KEY)
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Optimism");
    setUnit("ETH");
    setChainName("optimism");
  };
  return (
    <button className="toggle-menu text-sm" onClick={onClickOptimism}>
      Optimism
    </button>
  );
};

export default Optimism;
