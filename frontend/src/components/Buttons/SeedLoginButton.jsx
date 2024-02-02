import { useOutletContext } from "react-router-dom";

const SeedLoginButton = () => {
  const { setIsCreateLoginButtonClick } = useOutletContext();

  const onClickSeedLogin = () => {
    setIsCreateLoginButtonClick(2);
  };

  return (
    <button className="homepageButton" onClick={onClickSeedLogin}>
      seed phrase login button
    </button>
  );
};

export default SeedLoginButton;
