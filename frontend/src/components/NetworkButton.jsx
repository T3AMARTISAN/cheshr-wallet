import { useOutletContext } from "react-router-dom";

const NetworkButton = () => {
  const { setIsNetworkButtonClick, currentNetwork } = useOutletContext();

  const onClickNetwork = () => {
    setIsNetworkButtonClick(true);
  };

  return (
    <button className="text-sm" onClick={onClickNetwork}>
      ▼ network : {currentNetwork}
    </button>
  );
};

export default NetworkButton;
