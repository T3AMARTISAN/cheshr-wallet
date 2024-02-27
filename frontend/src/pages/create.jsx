import { useNavigate, useOutletContext } from "react-router-dom";
import EOAPassword from "../components/EOAPassword";
import NewWallet from "../components/NewWallet";
import { useContext, useEffect } from "react";
import { AuthContext } from "../components/Auth";
import BackButton from "../components/Buttons/BackButton";

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
  const { setLocked } = useContext(AuthContext);
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
    navigate(-1);
  };

  const onClickConfirm = () => {
    setLocked(false);
    setPasswordButtonClicked(1);
  };

  useEffect(() => {
    setPassword("");
    setConfirmPassword("");
  }, []);

  return (
    <>
      <button onClick={onClickBack}>
        <BackButton />
      </button>
      {passwordButtonClicked == 0 && (
        <>
          <div className="pt-28 mt-4 flex flex-col px-6 h-fit">
            <div className="flex flex-col justify-center dm-sans-body">
              <div className="whitespace-pre-line text-center text-purple-100 leading-6 text-lg pb-14">{`Hello there,
          what password will you use?`}</div>
              <EOAPassword />
            </div>
          </div>
          <div className="flex flex-row justify-around px-20">
            <button
              className={`mt-4 ${
                !passwordValid || !passwordsMatch || password.length < 8
                  ? "homepageButton-inactive"
                  : "homepageButton-rounded w-28 bg-[#69467A]"
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
    </>
  );
};

export default Create;
