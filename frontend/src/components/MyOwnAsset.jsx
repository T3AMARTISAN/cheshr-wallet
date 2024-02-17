const MyOwnAsset = ({
  ticker,
  value,
  isClick,
  setIsClick,
  setCurrentBalance,
  setCurrentTicker,
  setIsErc,
  setCurrentTokenAddress,
  tokenAddress,
}) => {
  const onClickSelectAsset = () => {
    setIsClick(!isClick);
    setCurrentBalance(value);
    setCurrentTicker(ticker);
    setIsErc(true);
    setCurrentTokenAddress(tokenAddress);
  };

  return (
    <div
      className="bg-green-100 border border-black"
      onClick={onClickSelectAsset}
    >
      {value} {ticker}
    </div>
  );
};

export default MyOwnAsset;
