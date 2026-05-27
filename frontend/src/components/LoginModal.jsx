import { useState } from "react";

function LoginModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");


//   This allows for both a regular user and the demo user to log in
const loginUser = async (loginEmail, loginPassword)=>{
    try{
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: loginEmail,
                password: loginPassword,
            }),
        });

        const data = await response.json();

        if(!response.ok){
            setMessage(data.message || "Login failed");
            return
        }

        // Save the autheticated session locally
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onLoginSuccess(data.user);

        setMessage("Login successful!");

        // Close the modal after a successful login
        onClose();
    } catch(error){
        console.error(error)

        setMessage("unable to connect to server")
    }
};

const handleLogin = async (event) => {
  event.preventDefault();

  await loginUser(email, password);
};

// allows an automatic demo login
const handleDemoLogin = async () => {
  await loginUser(
    "demo@kindredparenting.com",
    "demo123"
  );
};

  // Basic modal structure for auth integration.
  // Styling/layout can be refined later.
  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        {/* Closes login modal */}

        <button type="button" onClick={onClose}>
          X
        </button>

        {/* DEMO LOGIN BUTTON */}
        {/* Quick demo access for recruiters/testers */}
<button
  type="button"
  onClick={handleDemoLogin}
>
  Continue as Demo User
</button>

        <h2>Login</h2>


        {/* Login form */}
        <form onSubmit={handleLogin}>
          {/* EMAIL INPUT */}
          <label htmlFor="email">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          {/* PASSWORD INPUT */}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {/* SUBMIT BUTTON for the login request */}
          <button type="submit">Login</button>
        </form>

        {/* DISPLAYS the login status/error messages */}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
export default LoginModal;
