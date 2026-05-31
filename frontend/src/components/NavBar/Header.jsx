import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
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
          <input
            type="text"
            name="search_input"
            placeholder="Search..."
            className="search-bar"
          />
        </div>

        <div className="navbar-center">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/community" className="nav-link">
            Community
          </NavLink>
          <NavLink to="/my-space" className="nav-link">
            My Space
          </NavLink>
          <NavLink to="/whispers" className="nav-link">
            Whispers
          </NavLink>
          <NavLink to="/resources" className="nav-link">
            Resources
          </NavLink>
        </div>

        <div className="navbar-right">
          <p>+ Share</p>
          <NavLink to="/chat" className="nav-link">
            <img src={chatIcon} className="icon" alt="Chat icon" />
          </NavLink>
          <NavLink to="/notifications" className="nav-link">
            <img
              src={notificationsIcon}
              className="icon"
              alt="Notifications icon"
            />
          </NavLink>

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

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="profile-dropdown">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>
                    My Profile
                  </Link>
                  <Link to="/settings" onClick={() => setShowDropdown(false)}>
                    Settings
                  </Link>
                  <hr />
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
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLogin={(userData) => {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            setIsLoginOpen(false); // Close the modal upon success
          }}
        />
      )}
    </>
  );
}

export default NavBar;
