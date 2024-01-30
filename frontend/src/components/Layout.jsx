import { Outlet } from "react-router-dom";
import Menu from "./Menu";

const Layout = () => {
  return (
    <>
    <div className="bg-neutral-100">
      <div className="mx-auto">
        <Outlet />
      </div>
    </div>
    <Menu />
    </>
  );
};

export default Layout;
