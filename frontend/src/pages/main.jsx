import { useOutletContext } from "react-router-dom";
import MainLogo from "../components/Buttons/MainLogo";
import WalletDropdown from "../components/WalletDropdown";
import TotalAsset from "../components/TotalAsset";
import Menu from "../components/Menu";
import Tokens from "../components/Tokens";
import DeFi from "../components/DeFi";
import Nfts from "../components/Nfts";
import History from "../components/History";

const Main = () => {
  const { tabNumber, setTabNumber } = useOutletContext();

  return (
    //전체 컨테이너 - 모바일화면 크기
    <div className="container-feed h-screen radial-bg-home">
      <div className="sticky top-0 z-20 flex flex-row justify-between items-center w-full h-[80px]">
        <MainLogo />
        <WalletDropdown />
      </div>
      <div className="flex flex-col justify-center gap-1">
        <TotalAsset />
      </div>
      <div className="w-[480px] h-min-screen mx-auto bg-[#6e4a7f] rounded-t-3xl relative">
        {tabNumber == 0 ? <DeFi /> : ""}
        {tabNumber == 1 ? <Tokens /> : ""}
        {tabNumber == 2 ? <Nfts /> : ""}
        {tabNumber == 3 ? <History /> : ""}
        <Menu tabNumber={tabNumber} setTabNumber={setTabNumber} />
      </div>
    </div>
  );
};

export default Main;
