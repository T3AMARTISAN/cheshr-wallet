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
      <div className="flex flex-col gap-2">
        <input
          className="inputbox w-96 mx-auto"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password"
        />
        {password && !passwordValid && (
          <div className="invalid-text -translate-y-9 whitespace-pre text-left">
            <p>
              💡Include 1 uppercase letter, 1 lowercase letter, 1 number, 1
              symbol.
            </p>
            <p>💡At least 8 characters (12+ recommended).</p>
          </div>
        )}
        <input
          className="inputbox w-96 mx-auto mb-8"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm password"
        />
        {confirmPassword && !passwordsMatch && (
          <p className="invalid-text translate-y-24">Passwords do not match.</p>
        )}
      </div>
    </>
  );
};

export default EOAPassword;
