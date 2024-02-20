const NFTsButton = ({ setTabNumber, tabNumber }) => {
  const onClickNFTs = () => {
    setTabNumber(2);
  };

  return (
    <button
      onClick={onClickNFTs}
      className={`dashboard-menu ${tabNumber === 2 && "bg-[#9EFFAE]"}`}
    >
      NFTs
    </button>
  );
};

export default NFTsButton;
