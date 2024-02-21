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
    <button className="toggle-menu text-sm" onClick={onClickETHGoerli}>
      ETH Goerli
    </button>
  );
};

export default Goerli;
