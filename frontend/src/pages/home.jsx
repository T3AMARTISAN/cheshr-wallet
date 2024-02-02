import { Link, useOutletContext } from "react-router-dom";
import WalletName from "../components/WalletName";
import CreateWalletButton from "../components/Buttons/CreateWalletButton";
import CreateWallet from "../components/CreateWallet";
import SeedLogin from "../components/SeedLogin";
import SeedLoginButton from "../components/Buttons/SeedLoginButton";

const Home = () => {
  const { isCreateLoginButtonClick } = useOutletContext();

  return (
    <div className="container items-center bg-green-200">
      <div className="bg-yellow-300 top-0 sticky">
        <WalletName />
      </div>
      <div className=" bg-red-300 h-full flex flex-col px-6">
        {isCreateLoginButtonClick == 0 ? (
          <div className="grow flex flex-col gap-6 justify-center bg-purple-500">
            <div>
              {" "}
              <CreateWalletButton />
            </div>
            <div>
              {" "}
              <SeedLoginButton />
            </div>
          </div>
        ) : (
          ""
        )}
        {isCreateLoginButtonClick == 1 ? <CreateWallet /> : ""}
        {isCreateLoginButtonClick == 2 ? <SeedLogin /> : ""}
        {/* <div className="flex flex-col bg-blue-200 flex-grow justify-center gap-10 ">
          <CreateWalletButton />
          <div className="hompageButton">Seed Phrase Login</div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
