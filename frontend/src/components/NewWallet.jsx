import { useOutletContext } from "react-router-dom";

const NewWallet = () => {
  const { confirmPassword } = useOutletContext();
  console.log(confirmPassword);
  return <div>Wallet creation page</div>;
};

export default NewWallet;
