import { useOutletContext } from "react-router-dom";

const CreateWalletButton = () => {
  const { setIsCreateLoginButtonClick, isCeateLoginButtonClick } =
    useOutletContext();

  const onClickCreateWallet = () => {
    setIsCreateLoginButtonClick(1);
    console.log(isCeateLoginButtonClick);
  };

  return (
    <button className="homepageButton" onClick={onClickCreateWallet}>
      create wallet button
    </button>
  );
};

export default CreateWalletButton;
