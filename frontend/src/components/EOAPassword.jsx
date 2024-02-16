import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const EOAPassword = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordValid,
    setPasswordValid,
    passwordsMatch,
    setPasswordsMatch,
  } = useOutletContext();

  useEffect(() => {
    setPassword("");
    setConfirmPassword("");
  }, []);

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
    <>
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
            Include 1 uppercase letter, 1 lowercase letter, 1 number, and 1
            symbol and at least 8 characters (12+ recommended).
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
    </>
  );
};

export default EOAPassword;
