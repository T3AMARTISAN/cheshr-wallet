import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Sepolia = ({ isOpen, setIsOpen }) => {
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
    setIsOpen(!isOpen);
  };

  return (
    <button className="toggle-menu text-sm" onClick={onclickETHSepolia}>
      ETH Sepolia
    </button>
  );
};
export default Sepolia;
