import { Link } from "react-router-dom";

const Sidebar = () => {
  const chored_logo_path = "../assets/logo/chored_logo.png";
  return (
    <div className="h-screen sticky top-0 w-48 bg-gray-200 border-solid border-gray-300 p-4 text-black font-medium rounded-lg">
      <h2 className="text-xl font-semibold mb-6 ">
        <div className="flex size-9 items-center justify-between ">
          <img src={chored_logo_path} className="justify-start"/>
          <div className="justify-end">chored</div>
        </div>
      </h2>
      <ul className="space-y-4 text-xs">
        <li>
          <Link to="household" className="block p-1 rounded-md hover:bg-gray-300">
            Household
          </Link>
        </li>
        <li>
          <Link to="" className="block p-1 rounded-md hover:bg-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="profile" className="block p-1 rounded-md hover:bg-gray-300">
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
