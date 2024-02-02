import { Link } from "react-router-dom";
import TabBar from "./TabBar";

const Menu = ({ tabNumber, setTabNumber }) => {
  return (
    <div className="sticky bg-neutral-600 bottom-0 w-[480px] h-16 mx-auto rounded-b-xl ">
      <TabBar tabNumber={tabNumber} setTabNumber={setTabNumber} />
    </div>
  );
};

export default Menu;
