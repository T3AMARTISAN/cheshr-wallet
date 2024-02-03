import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

const TotalAsset = () => {
  const testAccount = process.env.REACT_APP_TEST_ACCOUNT;
  const { currentProvider, setBalance, balance, unit } = useOutletContext();

  useEffect(() => {
    const showMyBalance = async () => {
      const response = await currentProvider.getBalance(testAccount);
      const value = ethers.formatEther(String(response));
      setBalance(Number(value));
    };
    showMyBalance();
  });
  return (
    <div className="bg-neutral-500  py-3 h-[240px]  whitespace-pre">
      <ul className="text-neutral-50 font-light m-6 text-2xl">
        <li>February 29, 2024</li>
        <li>
          {balance} {unit}
        </li>
      </ul>
      <ul className="flex justify-between px-6">
        <li className="py-2 w-1/3 text-center rounded-md bg-red-200">Send</li>
        <li className="py-2 w-1/3 text-center  rounded-md bg-red-200">
          Receive
        </li>
      </ul>
    </div>
  );
};

export default TotalAsset;
