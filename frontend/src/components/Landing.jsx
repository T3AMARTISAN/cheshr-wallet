import WalletName from "../components/WalletName";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const onClickCreateWallet = () => {
    navigate("/wallet");
  };

  const onClickMountWallet = () => {
    navigate("/mount");
  };

  return (
    <>
      <div className="container items-center bg-green-200">
        <div className="bg-cyan-950 top-0 sticky">
          <WalletName />
        </div>
        <div className=" bg-cyan-100 h-full flex flex-col px-6">
          <div className="grow flex flex-col gap-6 bg-teal-50">
            <div>
              <img
                src="https://ipfs.io/ipfs/QmRtvNXVMaH8dgBQAF8CGSZVCJA2qPvJVisKUjDNGbzhPF"
                alt="logo"
              />

              <button className="homepageButton" onClick={onClickCreateWallet}>
                I need a wallet
              </button>
            </div>
            <div>
              <button className="homepageButton" onClick={onClickMountWallet}>
                I have a wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
