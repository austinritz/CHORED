import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen sticky top-0 w-48 bg-gray-100 border-solid border-2 p-4 text-black font-medium">
      <h2 className="text-xl font-semibold mb-6">User name and logo</h2>
      <ul className="space-y-4 text-xs">
        <li>
          <Link to="/household" className="block p-1 rounded-md hover:bg-gray-700">
            Household
          </Link>
        </li>
        <li>
          <Link to="" className="block p-1 rounded-md hover:bg-gray-700">
            Home
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
