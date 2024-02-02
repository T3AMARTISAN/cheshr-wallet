import { useOutletContext } from "react-router-dom";

const TokenButton = ({ setTabNumber, tabNumber }) => {
  const onClickTokens = () => {
    setTabNumber(0);
  };

  return <button onClick={onClickTokens}>Tokens</button>;
};

export default TokenButton;
