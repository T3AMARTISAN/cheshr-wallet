import { useOutletContext } from "react-router-dom";
import MainLogo from "../components/Buttons/MainLogo";
import WalletDropdown from "../components/WalletDropdown";
import NetworkButton from "../components/NetworkButton";
import TotalAsset from "../components/TotalAsset";
import Menu from "../components/Menu";
import Tokens from "../components/Tokens";
import DeFi from "../components/DeFi";
import Nfts from "../components/Nfts";
import History from "../components/History";

const Main = () => {
  const { tabNumber, setTabNumber, isNetworkButtonClick } = useOutletContext();

  return (
    //전체 컨테이너 - 모바일화면 크기
    <div className="container-feed h-screen radial-bg-feed">
      <div className="sticky top-0 z-20 flex flex-row justify-between items-center w-full h-[80px]">
        <MainLogo />
        <WalletDropdown />
      </div>
      {/*@TODO*/}
      {/* <div className="absolute left-0">
          {isNetworkButtonClick ? <NetworkSwitch /> : ""}
        </div> */}
      <div className="flex flex-col justify-center gap-1">
        {/*@TODO*/}
        <NetworkButton />
        <TotalAsset />
      </div>
      <div className="my-3">
        <Menu tabNumber={tabNumber} setTabNumber={setTabNumber} />
        {tabNumber == 0 ? <Tokens /> : ""}
        {tabNumber == 1 ? <DeFi /> : ""}
        {tabNumber == 2 ? <Nfts /> : ""}
        {tabNumber == 3 ? <History /> : ""}
      </div>
    </div>
  );
};

export default Main;
