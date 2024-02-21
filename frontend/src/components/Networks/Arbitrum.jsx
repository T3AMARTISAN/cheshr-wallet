import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Arbitrum = () => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
    setChainName,
  } = useOutletContext();

  const onClickArbitrum = () => {
    setCurrentProvider(
      new ethers.InfuraProvider("arbitrum", process.env.INFURA_API_KEY)
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Arbitrum");
    setUnit("ETH");
    setChainName("arbitrum");
  };
  return (
    <button className="toggle-menu text-sm" onClick={onClickArbitrum}>
      Arbitrum
    </button>
  );
};
export default Arbitrum;
