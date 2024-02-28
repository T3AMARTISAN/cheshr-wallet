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
  isLast,
}) => {
  const onClickSelectAsset = ({}) => {
    setIsClick(!isClick);
    setCurrentBalance(value);
    setCurrentTicker(ticker);
    setIsErc(true);
    setCurrentTokenAddress(tokenAddress);
  };

  return (
    <div
      className="translate-y-8 z-20 modal-dropdown"
      onClick={onClickSelectAsset}
    >
      <p className="hover:bg-[#9EFFAE]">
        {value} {ticker}
      </p>
    </div>
  );
};

export default MyOwnAsset;
