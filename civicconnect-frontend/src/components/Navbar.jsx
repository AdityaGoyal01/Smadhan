import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-500 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-xl">Smadhan</h1>

      <div className="flex gap-4 text-white">
        <Link to="/">Home</Link>

        {/* Citizen Links */}
        {user && role === "ROLE_CITIZEN" && (
          <>
            <Link to="/report">Report Issue</Link>
            <Link to="/my-reports">My Reports</Link>
          </>
        )}

        {/* Admin Links */}
        {user && role === "ROLE_ADMIN" && <Link to="/admin">Dashboard</Link>}

        {/* Auth Buttons */}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
