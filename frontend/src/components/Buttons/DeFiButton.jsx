import { useOutletContext } from "react-router-dom";

const DeFiButton = ({ setTabNumber, tabNumber }) => {
  const onClickDeFi = () => {
    setTabNumber(1);
  };

  return <button onClick={onClickDeFi}>DeFi</button>;
};

export default DeFiButton;
