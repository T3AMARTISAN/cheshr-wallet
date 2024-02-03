import { useOutletContext } from "react-router-dom";
import NetworkButton from "../components/NetworkButton";
import NetworkSwitch from "../components/NetworkSwitch";

const Main = () => {
  const { isNetworkButtonClick } = useOutletContext();

  return (
    <div
      className={` w-[480px] h-screen mx-auto flex flex-col items-center ${
        isNetworkButtonClick ? "bg-opacity-30" : "bg-neutral-300"
      }`}
    >
      <div className="text-neutral-900 font-extrabold text-7xl mb-6">
        DEX WALLET
      </div>

      <div className="bg-neutral-500 rounded-lg w-11/12 h-1/3 mb-6 whitespace-pre flex justify-between relative">
        <div className="text-neutral-50 font-light m-6 text-2xl">
          {"February 29, 2024\n$100"}
        </div>
        <NetworkButton />
        {isNetworkButtonClick ? <NetworkSwitch /> : ""}
      </div>

      <div className="bg-neutral-400 rounded-lg w-11/12 h-fit pb-10 flex flex-col">
        <div className="flex flex-row justify-between m-4">
          <div>ASSETS</div>
          <div>See Profit</div>
        </div>
        <div className="flex flex-row justify-between mx-4  text-neutral-200">
          <div>ASSET/AMOUNT </div>
          <div>PRICE</div>
          <div>USD</div>
        </div>
        <div className="flex flex-row justify-between mx-4  text-neutral-50">
          <div>USDT / 24.0379</div>
          <div>$0.9992</div>
          <div>$24.02</div>
        </div>
        <div className="flex flex-row justify-between mx-4  text-neutral-50">
          <div>USDT / 24.0379</div>
          <div>$0.9992</div>
          <div>$24.02</div>
        </div>
        <div className="flex flex-row justify-between mx-4  text-neutral-50">
          <div>USDT / 24.0379</div>
          <div>$0.9992</div>
          <div>$24.02</div>
        </div>
      </div>
      <div
        className={`bg-neutral-400 rounded-lg w-11/12 h-fit pb-10 my-10 flex flex-col ${
          isNetworkButtonClick ? "bg-opacity-30" : "bg-neutral-400"
        }`}
      >
        <div className="flex flex-row justify-between m-4">
          <div>UNISWAP POOL</div>
          <div>See Profit</div>
        </div>
        <div className="flex flex-row justify-between mx-4 text-neutral-200">
          <div>PROVIDED</div>
          <div>AMOUNT</div>
          <div>USD</div>
        </div>
        <div className="flex flex-row justify-between mx-4 text-neutral-50">
          <div>MATIC</div>
          <div>39</div>
          <div>$29.10</div>
        </div>
        <div className="flex flex-row justify-between mx-4  text-neutral-50">
          <div>USDT</div>
          <div>19</div>
          <div>$19.48</div>
        </div>
      </div>
    </div>
  );
};

export default Main;
