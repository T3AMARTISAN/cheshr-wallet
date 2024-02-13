import { useContext } from "react";
import { AuthContext } from "../Auth";
import { useNavigate } from "react-router-dom";

const LockButton = () => {
  const { setLocked } = useContext(AuthContext);
  const navigate = useNavigate();

  const onClickLogout = () => {
    setLocked(true);
    // navigate("/");
  };

  return <button onClick={onClickLogout}>Lock</button>;
};

export default LockButton;
