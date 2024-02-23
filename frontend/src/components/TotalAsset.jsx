import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import NetworkSwitch from "./NetworkSwitch";
import Send from "./SendModal";
import Import from "./ImportModal";

const TotalAsset = () => {
  const testAccount = process.env.REACT_APP_TEST_ACCOUNT;
  const { currentProvider, balance, setBalance, unit } = useOutletContext();
  const [sendOpen, setSendOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    const showMyBalance = async () => {
      const response = await currentProvider.getBalance(testAccount);
      const value = ethers.utils.formatEther(String(response));
      setBalance(Number(value));
    };
    showMyBalance();
  }, [balance]);

  return (
    <div className="flex flex-row items-center justify-between mx-4 whitespace-pre">
      <div className="my-20 text-2xl">
        {/* 오늘 날짜 */}
        <p className="dm-sans-title-feed">February 29, 2024</p>
        {/* 네트워크별 네이티브 토큰 총 잔액 */}
        <p className="dm-sans-body-feed">
          {balance} {unit}
        </p>
        {/* 네트워크 */}
        <NetworkSwitch />
      </div>
      <div className="flex flex-col items-start gap-2 justify-center">
        {/* Send 기능 */}
        {sendOpen ? (
          <Send sendOpen={sendOpen} setSendOpen={setSendOpen} />
        ) : (
          <div
            className="feed-button click:bg-purple-300 hover:bg-purple-400"
            onClick={() => setSendOpen(!sendOpen)}
          >
            Send
          </div>
        )}
        {/* Import 기능 */}
        {importOpen ? (
          <Import importOpen={importOpen} setImportOpen={setImportOpen} />
        ) : (
          <div
            className="feed-button click:bg-purple-300 hover:bg-purple-400"
            onClick={() => setImportOpen(!importOpen)}
          >
            Import
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalAsset;
