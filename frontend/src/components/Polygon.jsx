import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Polygon = () => {
  const { setIsNetworkButtonClick, setCurrentProvider } = useOutletContext();

  const onClickPolygon = () => {
    setCurrentProvider(
      new ethers.InfuraProvider("matic", process.env.INFURA_API_KEY)
    );
    setIsNetworkButtonClick(false);
  };

  return (
    <button
      className="border rounded-lg border-black py-1 pl-1 mr-1"
      onClick={onClickPolygon}
    >
      Polygon Mainnet
    </button>
  );
};

export default Polygon;
