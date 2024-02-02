import { useOutletContext } from "react-router-dom";

const NFTsButton = ({ setTabNumber, tabNumber }) => {
  const onClickNFTs = () => {
    setTabNumber(2);
  };

  return <button onClick={onClickNFTs}>NFTs</button>;
};

export default NFTsButton;
