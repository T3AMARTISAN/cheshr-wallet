const TokenCard = ({ ticker, value }) => {
  return (
    <div className="token-container">
      {/* 심볼이미지 */}
      <div className="token-symbol"></div>
      <div className="grow flex justify-between text-lg">
        <div className="flex flex-col items-start pl-2">
          {/* <div>{ticker}</div> */} {/*틱커*/}
          <div className="dm-sans-token-info">21.0314</div>
          {/* <div className="text-xs text-gray-800 ">{value}</div> */}{" "}
          {/*시세*/}
          <div className="dm-sans-body-feed text-base">USDT</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="dm-sans-token-info">$24.02</div>
          <div className="dm-sans-body-feed text-base">@1405.3</div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
