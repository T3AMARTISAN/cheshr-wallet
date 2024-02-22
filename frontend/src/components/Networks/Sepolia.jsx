import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Sepolia = () => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
  } = useOutletContext();

  const onclickETHSepolia = () => {
    setCurrentProvider(
      new ethers.providers.EtherscanProvider(
        "sepolia",
        process.env.REACT_APP_ETHERSCAN_API_KEY
      )
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Sepolia");
    setUnit("SepoliaETH");
  };

  return (
    <button
      className="border rounded-lg border-black py-1 pl-1 mr-1"
      onClick={onclickETHSepolia}
    >
      ETH Sepolia Test Network
    </button>
  );
};
export default Sepolia;
