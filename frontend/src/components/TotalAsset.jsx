import { useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
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
    <div className="flex flex-row items-center justify-between mx-4 whitespace-pre">
      <div className="my-20 text-2xl">
        <p className="dm-sans-title-feed">February 29, 2024</p>
        <p className="dm-sans-body-feed">
          {balance} {unit}
        </p>
      </div>
      <div className="flex flex-col items-start gap-2 justify-center">
        <Link to="/feed/send" className="feed-button">
          Send
        </Link>
        {/* 메뉴탭에 추가하기 */}
        {/* <Link
          className="rounded-md bg-red-200 w-20 px-4 text-center"
          to="/feed/history"
        >
          Log
        </Link> */}
        <Link to="/feed/import" className="feed-button">
          Import
        </Link>
      </div>
    </div>
  );
};

export default TotalAsset;
