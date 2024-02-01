import { useOutletContext } from "react-router-dom";

const NetworkButton = () => {
  const { setIsNetworkButtonClick } = useOutletContext();

  const onClickNetwork = () => {
    setIsNetworkButtonClick(true);
  };

  return (
    <div className="bg-blue-100 h-8 border rounded-lg mr-2 mt-2 hover:">
      <button className="px-2" onClick={onClickNetwork}>
        network
      </button>
    </div>
  );
};

export default NetworkButton;
