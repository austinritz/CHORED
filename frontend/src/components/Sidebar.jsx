import { Link, useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  // Helper function to check if link is active
  const isActive = (path) => {
    if (path === "") {
      return location.pathname === "/";
    }
    return location.pathname.includes(path);
  };

  return (
    <aside className="h-screen fixed top-0 w-56 bg-gray-50 border-r border-gray-200 py-6 px-4">
      <div className="mb-8 pl-2">
        <UserCircle className="h-8 w-8 text-gray-700" />
      </div>
      <nav>
        <ul className="space-y-2">
          {[
            { path: "household", label: "Household" },
            { path: "", label: "Home" },
            { path: "profile", label: "Profile" },
          ].map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`block px-4 py-2.5 text-sm font-medium rounded-md transition-colors
                  ${isActive(path)
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;