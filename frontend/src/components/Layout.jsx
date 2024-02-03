import { Outlet, useLocation } from "react-router-dom";
import Menu from "./Menu";
import { useState } from "react";

const Layout = () => {
  const [isNetworkButtonClick, setIsNetworkButtonClick] = useState();
  const [currentProvider, setCurrentProvider] = useState();
  const [currentNetwork, setCurrentNetwork] = useState("ETH");
  const [isCreateLoginButtonClick, setIsCreateLoginButtonClick] = useState(0);
  const [tabNumber, setTabNumber] = useState(0);

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
