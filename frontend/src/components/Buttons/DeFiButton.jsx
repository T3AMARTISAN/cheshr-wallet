import { useOutletContext } from "react-router-dom";

const DeFiButton = ({ setTabNumber, tabNumber }) => {
  const onClickDeFi = () => {
    setTabNumber(0);
  };

  return (
    <button
      onClick={onClickDeFi}
      className={`dashboard-menu ${tabNumber === 0 && "bg-[#9EFFAE]"}`}
    >
      DeFI
    </button>
  );
};

export default DeFiButton;
