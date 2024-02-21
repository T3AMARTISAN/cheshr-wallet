import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Polygon = () => {
  const {
    setIsNetworkButtonClick,
    setCurrentProvider,
    setCurrentNetwork,
    setUnit,
    setChainName,
  } = useOutletContext();

  const onClickPolygon = () => {
    setCurrentProvider(
      new ethers.InfuraProvider("matic", process.env.INFURA_API_KEY)
    );
    setIsNetworkButtonClick(false);
    setCurrentNetwork("Polygon");
    setUnit("MATIC");
    setChainName("matic");
  };

  return (
    <button className="toggle-menu text-sm" onClick={onClickPolygon}>
      Polygon
    </button>
  );
};

export default Polygon;
