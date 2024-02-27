import { FaGem } from "react-icons/fa";

const NFTsButton = ({ setTabNumber, tabNumber }) => {
  const onClickNFTs = () => {
    setTabNumber(2);
  };

  return (
    <button
      onClick={onClickNFTs}
      className={`dashboard-menu dashboard-menu-flex text-bold ${
        tabNumber === 2 && "dashboard-menu-active"
      }`}
    >
      <FaGem className="scale-125" />
      <div className="dm-sans text-lg pt-1">NFT</div>
    </button>
  );
};

export default NFTsButton;
