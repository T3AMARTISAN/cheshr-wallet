import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import { useState } from "react";

const Layout = () => {
  const [isCreateLoginButtonClick, setIsCreateLoginButtonClick] = useState(0);
  const [tabNumber, setTabNumber] = useState(0);

  return (
    <>
      <div className="bg-neutral-100">
        <div className="">
          <Outlet
            context={{
              isCreateLoginButtonClick,
              setIsCreateLoginButtonClick,
              tabNumber,
              setTabNumber,
            }}
          />
        </div>
      </div>
      <Menu tabNumber={tabNumber} setTabNumber={setTabNumber} />
    </>
  );
};

export default Layout;
