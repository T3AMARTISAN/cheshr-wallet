import { useEffect, useState } from "react";
import LockScreen from "../components/LockScreen";
import Landing from "../components/Landing";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const checkLocalStorage = () => {
    const walletData = localStorage.getItem("dexwalletData");
    return !!walletData;
  };

  useEffect(() => {
    checkLocalStorage();
  }, [checkLocalStorage()]);

  return (
    // // 로컬스토리지에 json 파일이 있으면 Lock 페이지 보여주기
    // // 없으면 기본 메인화면 보여주기
    <>
      {/* json 파일이 존재하면 LockScreen으로 이동 */}
      {checkLocalStorage() ? <LockScreen /> : <Landing />}
    </>
  );
};

export default Home;
