const TokenCard = ({ ticker, value }) => {
  return (
    <div className="token-container">
      {/* 심볼이미지 */}
      <div className="token-symbol relative bg-opacity-35">
        <img
          src="https://raw.githubusercontent.com/dorianbayart/CryptoLogos/main/dist/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
          alt="USDC"
          className="absolute inset-0 m-auto rounded-full w-8 h-8 shadow drop-shadow-md"
        />
      </div>
      <div className="grow flex justify-between text-lg">
        <div className="flex flex-col items-start pl-2">
          {/* 틱커 */}
          {/* <div>{ticker}</div> */}
          <div className="dm-sans-token-info">21.0314</div>
          {/* <div className="dm-sans-token-info">{ticker}</div> */}

          {/* <div className="text-xs text-gray-800 ">{value}</div> */}
          <div className="dm-sans-body-feed text-base">USDC</div>
          {/* <div className="dm-sans-body-feed text-base">{value}</div> */}
        </div>
        <div className="flex flex-col items-end">
          {/*USD 가치*/}
          <div className="dm-sans-token-info">$24.02</div>
          {/*시세*/}
          <div className="dm-sans-body-feed text-base">@1405.3</div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
