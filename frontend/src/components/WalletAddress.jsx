import LockButton from "./Buttons/LockButton";
import NetworkButton from "./NetworkButton";

const WalletAddress = () => {
  return (
    <div className="h-16 bg-neutral-300 rounded-t-xl mt-1 px-6 flex justify-between items-center">
      <NetworkButton />
      <div>🔐 0x1234...2ae</div>
      <LockButton />
    </div>
  );
};

export default WalletAddress;
