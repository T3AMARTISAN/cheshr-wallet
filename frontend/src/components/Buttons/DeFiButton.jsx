import { FaPercentage } from "react-icons/fa";

const DeFiButton = ({ setTabNumber, tabNumber }) => {
  const onClickDeFi = () => {
    setTabNumber(0);
  };

  return (
    <button
      onClick={onClickDeFi}
      className={`dashboard-menu dashboard-menu-flex text-bold ${
        tabNumber === 0 && "dashboard-menu-active"
      }`}
    >
      <FaPercentage className="scale-150" />
      <div className="dm-sans text-lg pt-1">DeFI</div>
    </button>
  );
};

export default DeFiButton;
