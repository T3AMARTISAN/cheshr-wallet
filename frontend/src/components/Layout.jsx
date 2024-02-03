import { Outlet, useLocation } from "react-router-dom";
import Menu from "./Menu";
import { useState } from "react";
import { ethers } from "ethers";

const Layout = () => {
  const [isNetworkButtonClick, setIsNetworkButtonClick] = useState();
  const [currentProvider, setCurrentProvider] = useState(
    new ethers.InfuraProvider()
  );
  const [currentNetwork, setCurrentNetwork] = useState("ETH");
  const [isCreateLoginButtonClick, setIsCreateLoginButtonClick] = useState(0);
  const [tabNumber, setTabNumber] = useState(0);
  const [balance, setBalance] = useState(0);
  const [unit, setUnit] = useState("ETH");

  const location = useLocation();

  return (
    <>
      <div className="">
        <Outlet
          context={{
            isCreateLoginButtonClick,
            setIsCreateLoginButtonClick,
            tabNumber,
            setTabNumber,
            isNetworkButtonClick,
            setIsNetworkButtonClick,
            currentProvider,
            setCurrentProvider,
            currentNetwork,
            setCurrentNetwork,
            balance,
            setBalance,
            unit,
            setUnit,
          }}
        />
      </div>

      {location.pathname !== "/" && (
        <Menu tabNumber={tabNumber} setTabNumber={setTabNumber} />
      )}
    </>
  );
};

export default Layout;
