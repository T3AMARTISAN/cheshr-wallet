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
          <div className="text-center leading-6 text-lg pb-10">
            <p className="bg-lime-200 font-medium">cheshr wallet</p>
            <p>for your defi journey</p>
          </div>
          <button
            className="homepageButton-rounded"
            onClick={onClickCreateWallet}
          >
            I need a wallet
          </button>
          <button
            className="homepageButton-rounded"
            onClick={onClickMountWallet}
          >
            I have a wallet
          </button>
        </div>
      </div>
    </>
  );
};

export default Landing;
