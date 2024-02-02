import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import { useState } from "react";

const Layout = () => {
  const [isNetworkButtonClick, setIsNetworkButtonClick] = useState();
  const [currentProvider, setCurrentProvider] = useState();
  const [currentNetwork, setCurrentNetwork] = useState();

  return (
    <>
      <div className="bg-neutral-100">
        <div className="mx-auto">
          <Outlet
            context={{
              isNetworkButtonClick,
              setIsNetworkButtonClick,
              currentProvider,
              setCurrentProvider,
              currentNetwork,
              setCurrentNetwork,
            }}
          />
        </div>
      </div>
      <Menu />
    </>
  );
};

export default Layout;
