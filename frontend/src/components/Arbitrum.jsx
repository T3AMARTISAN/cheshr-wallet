import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const Arbitrum = () => {
  const { setIsNetworkButtonClick, setCurrentProvider } = useOutletContext();

  const onClickArbitrum = () => {
    setCurrentProvider(
      new ethers.InfuraProvider("arbitrum", process.env.INFURA_API_KEY)
    );
    setIsNetworkButtonClick(false);
  };
  return (
    <button
      className="border rounded-lg border-black py-1 pl-1 mr-1"
      onClick={onClickArbitrum}
    >
      Arbitrum Mainnet
    </button>
  );
};
export default Arbitrum;
