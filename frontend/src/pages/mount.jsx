import { useNavigate } from "react-router-dom";
import MountWallet from "../components/MountWallet";
import BackButton from "../components/Buttons/BackButton";

const Mount = () => {
  const navigate = useNavigate();

  const onClickBack = () => {
    navigate(-1);
  };

  return (
    <>
      <button onClick={onClickBack}>
        <BackButton />
      </button>
      <MountWallet />
    </>
  );
};

export default Mount;
