import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Optimism = ({ isOpen, setIsOpen }) => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
    setChainName,
  } = useOutletContext();

  const onClickOptimism = () => {
    setCurrentProvider(
      new ethers.providers.EtherscanProvider(
        "optimism",
        process.env.REACT_APP_OPTIMISMSCAN_API_KEY
      )
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Optimism");
    setUnit("ETH");
    setChainName("optimism");
    setIsOpen(!isOpen);
  };
  return (
    <button className="toggle-menu text-sm" onClick={onClickOptimism}>
      Optimism
    </button>
  );
};

export default Optimism;
