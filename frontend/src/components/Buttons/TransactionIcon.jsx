import { MdCallMade, MdCallReceived } from "react-icons/md";

export const ReceiveIcon = () => {
  return (
    <div className="relative token-symbol bg-fuchsia-400">
      <MdCallReceived className="absolute items-center size-10 inset-1" />
    </div>
  );
};

export const SendIcon = () => {
  return (
    <div className="relative token-symbol bg-fuchsia-400">
      <MdCallMade className="absolute items-center size-10 inset-1" />
    </div>
  );
};
