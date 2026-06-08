import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import reflectionsLogo from "../../assets/Reflections-Logo.png";
import chatIcon from "../../assets/chat_bubble.png";
import notificationsIcon from "../../assets/notification_bell.png";
import profileIcon from "../../assets/Default-Profile-Female.png";
import LoginModal from "./LoginModal.jsx";

function NavBar() {
  // Controls whether the login modal is visible
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // Stores the currently authenticated user
  const [user, setUser] = useState(null);
  // Controls the visibility of the profile dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // *Note* to check the localStorge in the dev tools when the app loads
  // This is where the user will be saved when they login

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const getNavLinkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img
            src={reflectionsLogo}
            className="reflections-logo"
            alt="Reflections logo"
          />
          <span className="app-name">Kindred Parenting</span>
        </div>

        <div className="navbar-center">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/community" className="nav-link">
            Community
          </NavLink>
          {/* <NavLink to="/my-space" className="nav-link">
            My Space
          </NavLink> */}
          {/* <NavLink to="/whispers" className="nav-link">
            Whispers
          </NavLink> */}
          <NavLink to="/resources" className="nav-link">
            Resources
          </NavLink>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="share-button"
            onClick={() => {
              if (!user) {
                setIsLoginOpen(true);
                return;
              }

              navigate("/create-post");
            }}
          >
            + Share
          </button>
          {/* <NavLink to="/chat" className="nav-link">
            <img src={chatIcon} className="icon" alt="Chat icon" />
          </NavLink>
          <NavLink to="/notifications" className="nav-link">
            <img
              src={notificationsIcon}
              className="icon"
              alt="Notifications icon"
            />
          </NavLink> */}

          {/* if logged in, show Profile Icon; otherwise, show Login Button */}
          {user ? (
            <div className="profile-container">
              {/* Clicking the icon toggles a dropdown menu instead of navigating immediately */}
              <span className="user-name">{user.username}</span>
              <img
                src={profileIcon}
                className="icon profile-toggle"
                alt="Profile icon"
                onClick={() => setShowDropdown(!showDropdown)}
              />

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="profile-dropdown">
                  <button
                    type="button"
                    className="logout-button"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      setUser(null);
                      setShowDropdown(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsLoginOpen(true)}
              className="login-button"
            >
              Login
            </button>
          )}
        </div>
      </nav>
      {isLoginOpen && (
      <LoginModal
        onClose={() => setIsLoginOpen(false)}
        onLogin={(userData) => {
          setUser(userData);
          setIsLoginOpen(false);
        }}
      />
)}
    </>
  );
}

export default NavBar;
