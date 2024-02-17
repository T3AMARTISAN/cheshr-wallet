import { useEffect } from "react";
import LockScreen from "../components/LockScreen";
import Landing from "../components/Landing";

const Home = () => {
  const [hasWallet, setHasWallet] = useState(false);

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
      {hasWallet ? <LockScreen /> : <Landing />}
    </>
  );
};

export default Home;
