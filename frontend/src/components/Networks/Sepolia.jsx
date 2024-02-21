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
      new ethers.InfuraProvider("sepolia", process.env.INFURA_API_KEY)
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Sepolia");
    setUnit("SepoliaETH");
  };

  return (
    <button className="toggle-menu text-sm" onClick={onclickETHSepolia}>
      ETH Sepolia
    </button>
  );
};
export default Sepolia;
