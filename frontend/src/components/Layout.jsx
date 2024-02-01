import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import { useState } from "react";

const Layout = () => {
  const [isNetworkButtonClick, setIsNetworkButtonClick] = useState();

  return (
    <>
      <div className="bg-neutral-100">
        <div className="mx-auto">
          <Outlet context={{ isNetworkButtonClick, setIsNetworkButtonClick }} />
        </div>
      </div>
      <Menu />
    </>
  );
};

export default Layout;
