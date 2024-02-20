const TokenButton = ({ tabNumber, setTabNumber }) => {
  const onClickTokens = () => {
    setTabNumber(0);
  };

  return (
    <button
      onClick={onClickTokens}
      className={`dashboard-menu ${tabNumber === 0 && "bg-[#9EFFAE]"}`}
    >
      TOKENS
    </button>
  );
};

export default TokenButton;
