import { FaHockeyPuck } from "react-icons/fa";

const TokenButton = ({ tabNumber, setTabNumber }) => {
  const onClickTokens = () => {
    setTabNumber(1);
  };

  return (
    <button
      onClick={onClickTokens}
      className={`dashboard-menu dashboard-menu-flex text-bold ${
        tabNumber === 1 && "dashboard-menu-active"
      }`}
    >
      <FaHockeyPuck className="scale-125 -rotate-45" />
      <div className="dm-sans text-lg pt-1">Token</div>
    </button>
  );
};

export default TokenButton;
