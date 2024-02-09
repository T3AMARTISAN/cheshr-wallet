import { useNavigate, useOutletContext } from "react-router-dom";

const LockButton = () => {
  const { setPassword, setConfirmPassword, setCurrentAccount } =
    useOutletContext();
  const navigate = useNavigate();

  const onClickLogout = () => {
    // Deletes hash from local storage but keeps encrypted json
    // setPassword("");
    // setConfirmPassword("");
    // setCurrentAccount("");
    localStorage.removeItem("auth");

    // Redirects to the root page
    navigate("/");
  };

  return <button onClick={onClickLogout}>Lock</button>;
};

export default LockButton;
