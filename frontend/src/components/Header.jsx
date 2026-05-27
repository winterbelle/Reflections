import { useState, useEffect } from "react";
import "./Header.css";
import reflectionsLogo from "../assets/Reflections-Logo.png";
import chatIcon from "../assets/chat_bubble.png";
import notificationsIcon from "../assets/notification_bell.png";
import profileIcon from "../assets/Default-Profile-Female.png";
import LoginModal from "./LoginModal";
function Header() {
  // Controls whether the login modal is visible
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // Stores the currently authenticated user
  const [user, setUser] = useState(null);

  // *Note* to check the localStorge in the dev tools when the app loads
  // This is where the user will be saved when they login

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <>
      <header className="header-container">
        <div id="left-header">
          <img
            src={reflectionsLogo}
            className="reflections-logo"
            alt="Reflections logo"
          ></img>
          <input
            type="text"
            name="search_input"
            placeholder="Search..."
            className="search-bar"
          ></input>
        </div>

        <div id="center-header">
          <a href="#" className="header-link">
            Home
          </a>
          <a href="#" className="header-link">
            Communities
          </a>
          <a href="#" className="header-link">
            My Space
          </a>
          <a href="#" className="header-link">
            Whispers
          </a>
          <a href="#" className="header-link">
            Resources
          </a>
        </div>

        <div id="right-header">
          <p>+ Share</p>

          {/* Opens login modal */}
          {user ? (
            <button
              type="button"
              onClick={() => {
                // Clear saved login session
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                // This will bring back the login button when the user logs out
                setUser(null);
              }}
            >
              Logout
            </button>
          ) : (
            <button type="button" onClick={() => setIsLoginOpen(true)}>
              Login
            </button>
          )}

          <a href="#" className="image-link">
            <img src={chatIcon} alt="Chat Icon"></img>
          </a>

          <a href="#" className="image-link">
            <img src={notificationsIcon} alt="Notifications Icon"></img>
          </a>

          <a href="#" className="image-link">
            <img
              src={profileIcon}
              id="profile-icon"
              alt="Default Profile Icon"
            ></img>
          </a>
        </div>
      </header>
      {/* Render modal only when login is clicked and opens modal*/}
      {/* Render modal only when Login is clicked */}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
        />
      )}
    </>
  );
}

export default Header;
