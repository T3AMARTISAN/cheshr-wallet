import { useOutletContext } from "react-router-dom";
import Assets from "../components/Tokens";
import LpPoolCard from "../components/LpPoolCard";
import TabBar from "../components/TabBar";
import TotalAsset from "../components/TotalAsset";
import WalletAddress from "../components/WalletAddress";
import DeFi from "../components/DeFi";
import Tokens from "../components/Tokens";

const Main = () => {
  const { tabNumber, setTabNumber } = useOutletContext();

  return (
    //전체 컨테이너 - 모바일화면 크기
    <div className=" container  bg-red-100  overflow-y-auto ">
      <div className="bg-yellow-100 ">
        {/* user wallet address */}
        <div className="sticky top-0 ">
          <WalletAddress />
        </div>
        {/* total asset block */}
        <TotalAsset />
        <div className="my-3">
          {tabNumber == 0 ? <Tokens /> : ""}
          {tabNumber == 1 ? <DeFi /> : ""}

          {/* lp pool block */}
        </div>
      </div>
    </div>
  );
};

export default Main;
