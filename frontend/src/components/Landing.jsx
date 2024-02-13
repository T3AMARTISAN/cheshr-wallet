import { useState } from "react";
import WalletName from "../components/WalletName";
import Create from "../pages/create";
import { useNavigate } from "react-router-dom";
// import CreateWalletButton from "../components/Buttons/CreateWalletButton";
// import SeedImportButton from "../components/Buttons/SeedImportButton";

const Landing = () => {
  const navigate = useNavigate();

  const onClickCreateWallet = () => {
    navigate("/wallet");
  };

  //   const onClickSeedImport = () => {
  //     // navigate("/import");
  //   };

  return (
    <>
      <div className="container items-center bg-green-200">
        <div className="bg-yellow-300 top-0 sticky">
          <WalletName />
        </div>
        <div className=" bg-red-300 h-full flex flex-col px-6">
          <div className="grow flex flex-col gap-6 justify-center bg-purple-500">
            <div>
              {/* <CreateWalletButton /> */}
              <button className="homepageButton" onClick={onClickCreateWallet}>
                create wallet button
              </button>
            </div>
            <div>
              {/* <SeedImportButton /> */}
              {/* <button className="homepageButton" onClick={onClickSeedImport}>
                seed phrase login button
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
