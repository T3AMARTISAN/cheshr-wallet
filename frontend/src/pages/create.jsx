import { useNavigate, useOutletContext } from "react-router-dom";
import EOAPassword from "../components/EOAPassword";
import NewWallet from "../components/NewWallet";

const Create = () => {
  const {
    passwordButtonClicked,
    setPasswordButtonClicked,
    password,
    setPassword,
    setConfirmPassword,
    passwordValid,
    setPasswordValid,
    passwordsMatch,
    setPasswordsMatch,
  } = useOutletContext();
  const navigate = useNavigate();

  const passwordReset = () => {
    setPassword("");
    setConfirmPassword("");
    setPasswordValid(false);
    setPasswordsMatch(false);
  };

  const onClickCancel = () => {
    passwordReset();
    navigate(-1);
  };

  const onClickConfirm = () => {
    setPasswordButtonClicked(1);
  };

  return (
    <div className="container overflow-y-auto">
      {passwordButtonClicked == 0 && (
        <>
          <div className="bg-blue-100 text-center text-2xl p-2 mb-6">
            create wallet page
          </div>
          <div className="bg-green-100 h-5/6 mb-6">
            <EOAPassword />
          </div>
          <div className="flex flex-row justify-around px-20">
            <button
              className="bg-purple-100 rounded-md p-2"
              onClick={onClickCancel}
            >
              Cancel
            </button>
            <button
              className={`rounded-md p-2 ${
                !passwordValid || !passwordsMatch || password.length < 8
                  ? "bg-neutral-500 cursor-not-allowed"
                  : "bg-purple-100"
              }`}
              disabled={
                !passwordValid || !passwordsMatch || password.length < 8
              }
              onClick={onClickConfirm}
            >
              Confirm
            </button>
          </div>
        </>
      )}
      {passwordButtonClicked == 1 && <NewWallet />}
    </div>
  );
};

export default Create;
