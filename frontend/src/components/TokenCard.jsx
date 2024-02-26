import axios from "axios";
import { useEffect, useState } from "react";

const TokenCard = ({ ticker, value, totalValue, setTotalValue }) => {
  const [price, setPrice] = useState();

  const getPrice = async () => {
    try {
      var symbol = "";
      if (ticker == "WETH") {
        symbol = "ETH";
      } else {
        symbol = ticker;
      }
      var response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
      );
      setPrice(response.data.price);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getPrice();
  }, [ticker]);

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
          <div className="dm-sans-token-info">{value.toFixed(4)}</div>
          <div className="dm-sans-body-feed text-base">{ticker}</div>
        </div>
        <div className="flex flex-col items-end">
          {/*USD 가치*/}
          <div className="dm-sans-token-info">{(value * price).toFixed(4)}</div>
          {/*시세*/}
          <div className="dm-sans-body-feed text-base">
            {Number(price).toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
