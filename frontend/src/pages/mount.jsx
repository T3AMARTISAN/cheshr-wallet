import MountWallet from "../components/MountWallet";

const Mount = () => {
  return (
    <div className="container overflow-y-auto">
      <div className="bg-blue-100 text-center text-2xl p-2 mb-6">
        Mount your wallet
      </div>
      <MountWallet />
    </div>
  );
};

export default Mount;
