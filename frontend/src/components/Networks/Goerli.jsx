import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Goerli = () => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
  } = useOutletContext();

  const onClickETHGoerli = () => {
    setCurrentProvider(
      new ethers.InfuraProvider("goerli", process.env.INFURA_API_KEY)
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Goerli");
    setUnit("GoerliETH");
  };

  return (
    <button
      className="border rounded-lg border-black py-1 pl-1 mr-1"
      onClick={onClickETHGoerli}
    >
      ETH Goerli Test Network
    </button>
  );
};

export default Goerli;
