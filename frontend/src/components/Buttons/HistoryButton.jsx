import { FaStream } from "react-icons/fa";

const HistoryButton = ({ setTabNumber, tabNumber }) => {
  const onClickHistory = () => {
    setTabNumber(3);
  };

  return (
    <button
      onClick={onClickHistory}
      className={`dashboard-menu dashboard-menu-flex text-bold  ${
        tabNumber === 3 && "dashboard-menu-active"
      }`}
    >
      <FaStream className="scale-125" />
      <div className="dm-sans text-lg pt-1">Log</div>
    </button>
  );
};

export default HistoryButton;
