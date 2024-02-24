const TokenButton = ({ tabNumber, setTabNumber }) => {
  const onClickTokens = () => {
    setTabNumber(1);
  };

  return (
    <button
      onClick={onClickTokens}
      className={`dashboard-menu ${tabNumber === 1 && "bg-[#9EFFAE]"}`}
    >
      TOKENS
    </button>
  );
};

export default TokenButton;
