import { useOutletContext } from "react-router-dom";

const NetworkButton = () => {
  const { setIsNetworkButtonClick, currentNetwork } = useOutletContext();

  const onClickNetwork = () => {
    setIsNetworkButtonClick(true);
  };

  return (
    <button className="toggle-dropdown w-fit text-sm" onClick={onClickNetwork}>
      ▼ Network: {currentNetwork}
    </button>
  );
};

export default NetworkButton;
