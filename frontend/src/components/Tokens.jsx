import TokenCard from "./TokenCard";
import AssetCard from "./TokenCard";

const Tokens = () => {
  return (
    <div className="bg-neutral-400 rounded-lg h-fit pb-10 flex flex-col">
      <div className="flex flex-row justify-between"></div>
      <div className="flex flex-row justify-between   text-neutral-200"></div>
      <TokenCard ticker={"USDT"} />
      <TokenCard ticker={"ETH"} />
      <TokenCard ticker={"MATIC"} />
      <TokenCard ticker={"BNB"} />
      <TokenCard ticker={"OP"} />
      <TokenCard ticker={"ARB"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
      <TokenCard ticker={"AVAX"} />
    </div>
  );
};

export default Tokens;
