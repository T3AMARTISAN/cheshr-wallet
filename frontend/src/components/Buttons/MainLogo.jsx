import { useNavigate } from "react-router-dom";

const MainLogo = () => {
  return (
    <div className="relative flex justify-center items-center scale-50 px-2">
      <img src="./images/logo2.png" className="mx-auto w-20" />
      <div className="absolute dm-sans-title text-4xl">cheshr</div>
    </div>
  );
};

export default MainLogo;
