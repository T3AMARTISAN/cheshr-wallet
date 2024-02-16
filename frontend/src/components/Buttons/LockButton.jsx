import { useContext } from "react";
import { AuthContext } from "../Auth";
import { useNavigate, useOutletContext } from "react-router-dom";

const LockButton = () => {
  const { setLocked, setPw } = useContext(AuthContext);
  const { setCurrentAccount } = useOutletContext();
  const navigate = useNavigate();

  const onClickLogout = () => {
    setPw("");
    setCurrentAccount("");
    setLocked(true);
    navigate("/");
  };

  return (
    <button onClick={onClickLogout} className="text-sm">
      🔐Lock
    </button>
  );
};

export default LockButton;
