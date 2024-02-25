import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Polygon = ({ isOpen, setIsOpen }) => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
    setChainName,
  } = useOutletContext();

  const onClickPolygon = () => {
    setCurrentProvider(
      new ethers.providers.EtherscanProvider(
        "matic",
        process.env.REACT_APP_POLYGONSCAN_API_KEY
      )
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Polygon");
    setUnit("MATIC");
    setChainName("matic");
    setIsOpen(!isOpen);
  };

  return (
    <button className="toggle-menu text-sm" onClick={onClickPolygon}>
      Polygon
    </button>
  );
};

export default Polygon;
