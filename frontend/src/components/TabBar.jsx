import DeFiButton from "./Buttons/DeFiButton";
import NFTsButton from "./Buttons/NFTsButton";
import TokenButton from "./Buttons/TokenButton";

const TabBar = ({ tabNumber, setTabNumber }) => {
  return (
    <div className="h-16 bg-blue-100 px-6 flex justify-between sticky top-16 items-center font-bold">
      <TokenButton tabNumber={tabNumber} setTabNumber={setTabNumber} />
      <DeFiButton tabNumber={tabNumber} setTabNumber={setTabNumber} />
      <NFTsButton tabNumber={tabNumber} setTabNumber={setTabNumber} />
    </div>
  );
};

export default TabBar;
