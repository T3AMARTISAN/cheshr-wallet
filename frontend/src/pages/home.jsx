import WalletName from "../components/WalletName";
import CreateWalletButton from "../components/Buttons/CreateWalletButton";
import SeedLoginButton from "../components/Buttons/SeedLoginButton";

const Home = () => {
  return (
    <div className="container items-center bg-green-200">
      <div className="bg-yellow-300 top-0 sticky">
        <WalletName />
      </div>
      <div className=" bg-red-300 h-full flex flex-col px-6">
        <div className="grow flex flex-col gap-6 justify-center bg-purple-500">
          <div>
            <CreateWalletButton />
          </div>
          <div>
            <SeedLoginButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
