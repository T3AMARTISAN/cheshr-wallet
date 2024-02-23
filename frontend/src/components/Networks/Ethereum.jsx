import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Ethereum = () => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
    setChainName,
  } = useOutletContext();

  const onClickETH = () => {
    setCurrentProvider(
      new ethers.providers.EtherscanProvider(
        "homestead",
        process.env.REACT_APP_ETHERSCAN_API_KEY
      )
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Ethereum");
    setUnit("ETH");
    setChainName("ethereum");
  };

  return (
    <button className="toggle-menu text-sm" onClick={onClickETH}>
      Ethereum
    </button>
  );
};
export default Ethereum;
