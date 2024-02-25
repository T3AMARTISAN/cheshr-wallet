import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Arbitrum = ({ isOpen, setIsOpen }) => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
    setChainName,
  } = useOutletContext();

  const onClickArbitrum = () => {
    setCurrentProvider(
      // v6 : new ethers.InfuraProvider("arbitrum", process.env.INFURA_API_KEY)
      // v5
      new ethers.providers.EtherscanProvider(
        "arbitrum",
        process.env.REACT_APP_ARBISCAN_API_KEY
      )
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Arbitrum");
    setUnit("ETH");
    setChainName("arbitrum");
    setIsOpen(!isOpen);
  };
  return (
    <button className="toggle-menu text-sm" onClick={onClickArbitrum}>
      Arbitrum
    </button>
  );
};
export default Arbitrum;
