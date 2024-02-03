import { useOutletContext } from "react-router-dom";
import TotalAsset from "../components/TotalAsset";
import WalletAddress from "../components/WalletAddress";
import DeFi from "../components/DeFi";
import Tokens from "../components/Tokens";
import NetworkSwitch from "../components/NetworkSwitch";
import Menu from "../components/Menu";
import Nfts from "../components/Nfts";

const Main = () => {
  const { tabNumber, setTabNumber, isNetworkButtonClick } = useOutletContext();

  return (
    //전체 컨테이너 - 모바일화면 크기
    <div className=" container  bg-red-100  overflow-y-auto ">
      <div className="bg-yellow-100 ">
        {/* user wallet address */}
        <div className="sticky top-0 ">
          <WalletAddress />
          {isNetworkButtonClick ? <NetworkSwitch /> : ""}
        </div>
        {/* total asset block */}
        <TotalAsset />
        <div className="my-3">
          {tabNumber == 0 ? <Tokens /> : ""}
          {tabNumber == 1 ? <DeFi /> : ""}
          {tabNumber == 2 ? <Nfts /> : ""}
        </div>
      </div>
      <Menu tabNumber={tabNumber} setTabNumber={setTabNumber} />
    </div>
  );
};

export default Main;
