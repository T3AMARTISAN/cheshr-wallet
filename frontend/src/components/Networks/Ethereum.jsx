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
      new ethers.InfuraProvider("mainnet", process.env.INFURA_API_KEY)
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("ETH");
    setUnit("ETH");
    setChainName("ethereum");
  };

  return (
    <button
      className="border rounded-lg border-black py-1 px-1 mr-1"
      onClick={onClickETH}
    >
      Ethereum Mainnet
    </button>
  );
};
export default Ethereum;
