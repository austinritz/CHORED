import { Link, useLocation } from "react-router-dom";
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
    </aside>
  );
};

export default Sidebar;