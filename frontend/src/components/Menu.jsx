import DeFiButton from "./Buttons/DeFiButton";
import NFTsButton from "./Buttons/NFTsButton";
import TokenButton from "./Buttons/TokenButton";
import HistoryButton from "./Buttons/HistoryButton";

const Menu = ({ tabNumber, setTabNumber }) => {
  return (
    <div className="dashboard-navibar">
      <DeFiButton tabNumber={tabNumber} setTabNumber={setTabNumber} />
      <TokenButton tabNumber={tabNumber} setTabNumber={setTabNumber} />
      <NFTsButton tabNumber={tabNumber} setTabNumber={setTabNumber} />
      <HistoryButton tabNumber={tabNumber} setTabNumber={setTabNumber} />
    </div>
  );
};

export default Menu;
