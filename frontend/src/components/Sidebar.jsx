import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUserCircle } from "react-icons/fa";
import "../assets/components/Sidebar.css";

/* Sidebar component 
- Shows a logo and a list of navigation links
- order is 1. Profile Picture 2. Home button 3. Task list (my tasks)
*/
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
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link 
          to="/" 
          className={`sidebar-link ${isActive("") ? "active" : ""}`}
          title="Home"
        >
          <FaHome className="sidebar-icon" />
        </Link>
        <Link 
          to="/profile" 
          className={`sidebar-link ${isActive("/profile") ? "active" : ""}`}
          title="Profile"
        >
          <FaUserCircle className="sidebar-icon" />
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;