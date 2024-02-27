import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import NetworkSwitch from "./NetworkSwitch";
import Send from "./SendModal";
import Import from "./ImportModal";

const TotalAsset = () => {
  const testAccount = process.env.REACT_APP_TEST_ACCOUNT;
  const {
    currentProvider,
    balance,
    setBalance,
    unit,
    importOpen,
    setImportOpen,
    totalValue,
  } = useOutletContext();
  const [sendOpen, setSendOpen] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    const showMyBalance = async () => {
      // 테스트 계정 잔액 표시 (필요 시 로그인 계정으로 수정)
      const response = await currentProvider.getBalance(testAccount);
      const value = ethers.utils.formatEther(String(response));
      setBalance(Number(value));
    };
    showMyBalance();
  }, [balance]);

  // useEffect(() => {
  //   const getDate = () => {
  //     const currentDate = new Date();

  //     const formattedDate = currentDate.toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     });

  //     setDate(formattedDate);
  //   };

  //   getDate();
  // }, [date]);

  return (
    <div className="flex flex-row items-center justify-between mx-4 whitespace-pre">
      <div className="my-14 pb-4">
        {/* 총 자산 (USD) = DeFi + Token */}
        <div className="dm-sans-title-feed linear-bg-text">$250.35</div>
        {/* 네트워크별 네이티브 토큰 총 잔액 */}
        {/* <p className="dm-sans-body-feed">
          {totalValue} {unit}
        </p> */}
        {/* 네트워크 */}
        <NetworkSwitch />
      </div>
      <div className="flex flex-col items-start gap-2 justify-center">
        {/* Import 기능 */}
        {importOpen ? (
          <Import />
        ) : (
          <div
            className="feed-button linear-bg-btn click:bg-purple-300"
            onClick={() => setImportOpen(!importOpen)}
          >
            Import
          </div>
        )}
        {/* Send 기능 */}
        {sendOpen ? (
          <Send sendOpen={sendOpen} setSendOpen={setSendOpen} />
        ) : (
          <div
            className="feed-button linear-bg-btn"
            onClick={() => setSendOpen(!sendOpen)}
          >
            Send
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalAsset;
