import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import { useState } from "react";

const Layout = () => {
  const [isNetworkButtonClick, setIsNetworkButtonClick] = useState();

  const [isCreateLoginButtonClick, setIsCreateLoginButtonClick] = useState(0);
  const [tabNumber, setTabNumber] = useState(0);

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
          }}
        />
      </div>

      <Menu tabNumber={tabNumber} setTabNumber={setTabNumber} />
    </>
  );
};

export default Layout;
