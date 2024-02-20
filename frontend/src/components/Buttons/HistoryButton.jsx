const HistoryButton = ({ setTabNumber, tabNumber }) => {
  const onClickHistory = () => {
    setTabNumber(3);
  };

  return (
    <button
      onClick={onClickHistory}
      className={`dashboard-menu ${tabNumber === 3 && "bg-[#9EFFAE]"}`}
    >
      HISTORY
    </button>
  );
};

export default HistoryButton;
