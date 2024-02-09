import { useNavigate } from "react-router-dom";

const CreateWalletButton = () => {
  const navigate = useNavigate();

  const onClickCreateWallet = () => {
    navigate("/wallet");
  };

  return (
    <button className="homepageButton" onClick={onClickCreateWallet}>
      create wallet button
    </button>
  );
};

export default CreateWalletButton;
