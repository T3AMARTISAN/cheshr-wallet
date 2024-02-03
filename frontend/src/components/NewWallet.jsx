import { useNavigate, useOutletContext } from "react-router-dom";

const NewWallet = () => {
  const {
    confirmPassword,
    setPassword,
    setConfirmPassword,
    setPasswordValid,
    setPasswordsMatch,
    setPasswordButtonClicked,
  } = useOutletContext();
  const navigate = useNavigate();

  const passwordReset = () => {
    setPassword("");
    setConfirmPassword("");
    setPasswordValid(false);
    setPasswordsMatch(false);
  };

  const onClickBack = () => {
    passwordReset();
    setPasswordButtonClicked(0);
  };

  const onClickOK = () => {
    passwordReset();
    navigate("/main");
  };

  return (
    <div className="container overflow-y-auto">
      <div className="bg-blue-100 text-center text-2xl p-2 mb-6">
        create new wallet
      </div>
      <div className="bg-green-100 h-5/6 mb-6">
        <div className="text-lg text-center pt-2">
          Here is your private key:
        </div>
        <div className="flex flex-col gap-2 p-6"></div>
      </div>
      <div className="flex flex-row justify-around px-20">
        <button
          className="bg-purple-100 rounded-md p-2 px-4"
          onClick={onClickBack}
        >
          Back
        </button>
        <button
          className="bg-purple-100 rounded-md p-2 px-5"
          onClick={onClickOK}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default NewWallet;
