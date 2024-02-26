import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const onClickCreateWallet = () => {
    navigate("/wallet");
  };

  const onClickMountWallet = () => {
    navigate("/mount");
  };

  return (
    <>
      <div className="pt-28 mt-12 flex flex-col px-6 h-fit">
        <div className="flex flex-col gap-4 items-center justify-center dm-sans-body">
          <div className="text-center text-purple-100 leading-6 text-lg pb-10">
            <p>cheshr wallet</p>
            <p>for your defi journey</p>
          </div>
          <button
            className="homepageButton-rounded linear-bg-button network-button"
            onClick={onClickCreateWallet}
          >
            Make Address
          </button>
          <button
            className="homepageButton-rounded linear-bg-button"
            onClick={onClickMountWallet}
          >
            Mount Address
          </button>
        </div>
      </div>
    </>
  );
};

export default Landing;
