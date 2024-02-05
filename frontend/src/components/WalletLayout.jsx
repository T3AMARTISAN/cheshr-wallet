import { Outlet } from "react-router-dom";
import { useState } from "react";

const WalletLayout = () => {
  const [currentAccount, setCurrentAccount] = useState();
  const [passwordButtonClicked, setPasswordButtonClicked] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  return (
    <>
      <div className="">
        <Outlet
          context={{
            currentAccount,
            setCurrentAccount,
            password,
            setPassword,
            confirmPassword,
            setConfirmPassword,
            passwordValid,
            setPasswordValid,
            passwordsMatch,
            setPasswordsMatch,
            passwordButtonClicked,
            setPasswordButtonClicked,
          }}
        />
      </div>
    </>
  );
};

export default WalletLayout;
