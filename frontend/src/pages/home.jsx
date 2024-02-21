import { useEffect, useState } from "react";
import LockScreen from "../components/LockScreen";
import Landing from "../components/Landing";

const Home = () => {
  const [hasWallet, setHasWallet] = useState();

  const checkLocalStorage = () => {
    const walletData = localStorage.getItem("dexwalletData");
    setHasWallet(!!walletData);
  };

  useEffect(() => {
    checkLocalStorage();
  }, [hasWallet]);

  return (
    <>
      {/* json 파일이 존재하면 LockScreen으로 이동 */}
      {hasWallet === undefined && (
        <div className="sticky bottom-0 hidden"></div>
      )}
      {hasWallet ? <LockScreen /> : <Landing />}
    </>
  );
};

export default Home;
