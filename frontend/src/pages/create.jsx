import { useNavigate, useOutletContext } from "react-router-dom";
import NewWallet from "../components/NewWallet";

const Create = () => {
  const {
    passwordButtonClicked,
    setPasswordButtonClicked,
    password,
    setPassword,
    confirmPassword,
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

  const validatePassword = (password) => {
    // 대문자, 소문자, 숫자 및 기호 조합
    // 최소 8자 이상 (12자 이상 권장)
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    setPasswordValid(regex.test(password));
  };

  const checkPasswordsMatch = () => {
    setPasswordsMatch(password === confirmPassword);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
    if (confirmPassword) {
      checkPasswordsMatch();
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordsMatch(password === event.target.value);
  };

  return (
    <div className="container overflow-y-auto">
      {passwordButtonClicked == 0 ? (
        <>
          <div className="bg-blue-100 text-center text-2xl p-2 mb-6">
            create wallet page
          </div>
          <div className="bg-green-100 h-5/6 mb-6">
            <div className="text-lg text-center pt-2">Set your password</div>
            <div className="flex flex-col gap-2 p-6">
              <input
                className="rounded-md p-1"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
              />
              {password && !passwordValid && (
                <p className="text-xs">
                  Include 1 uppercase letter, 1 lowercase letter, 1 number, and
                  1 symbol and at least 8 characters (12+ recommended).
                </p>
              )}
              <input
                className="rounded-md p-1"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm password"
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs">Passwords do not match</p>
              )}
            </div>
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
      ) : (
        ""
      )}
      {passwordButtonClicked == 1 && <NewWallet />}
    </div>
  );
};

export default Create;
