import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Goerli = ({ isOpen, setIsOpen }) => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
  } = useOutletContext();

  const onClickETHGoerli = () => {
    setCurrentProvider(
      new ethers.providers.EtherscanProvider(
        "goerli",
        process.env.REACT_APP_ETHERSCAN_API_KEY
      )
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Goerli");
    setUnit("GoerliETH");
    setIsOpen(!isOpen);
  };

  return (
    <button className="toggle-menu text-sm" onClick={onClickETHGoerli}>
      ETH Goerli
    </button>
  );
};

export default Goerli;
