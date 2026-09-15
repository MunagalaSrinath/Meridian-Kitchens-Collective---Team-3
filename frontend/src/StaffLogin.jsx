// import { useState } from "react";
// import axios from "axios";

// function StaffLogin({ onLogin }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     if (!username || !password) {
//       alert("Please enter username and password.");
//       return;
//     }

//     axios
//       .post("http://127.0.0.1:8000/login", {
//         username: username,
//         password: password,
//       })
//       .then((response) => {
//         onLogin(response.data);
//       })
//       .catch((error) => {
//         console.error("Login error:", error);
//         alert("Invalid username or password");
//       });
//   };

//   return (
//     <div>
//       <h1>🔐 Staff / Manager Login</h1>

//       <div>
//         <label>Username:</label>
//         <br />
//         <input
//           type="text"
//           placeholder="Enter username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>

//       <br />

//       <div>
//         <label>Password:</label>
//         <br />
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>

//       <br />

//       <button onClick={handleLogin}>
//         Login
//       </button>
//     </div>
//   );
// }

// export default StaffLogin;


import { useState } from "react";
import axios from "axios";

function StaffLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    axios
      .post("http://127.0.0.1:8000/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        onLogin(response.data);
      })
      .catch((error) => {
        console.error("Login error:", error);
        setErrorMessage("Invalid username or password.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-page">

      {/* Decorative background */}

      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>


      {/* Back to public menu */}

      <button
        type="button"
        className="login-back-button"
        onClick={() => window.location.reload()}
      >
        ← Back to Menu
      </button>


      {/* Main login area */}

      <div className="login-wrapper">

        {/* Left branding panel */}

        <div className="login-brand-panel">

          <div className="login-brand-icon">
            M
          </div>

          <p className="login-brand-small">
            MERIDIAN
          </p>

          <h1>
            Kitchens
            <br />
            Collective
          </h1>

          <div className="login-brand-line"></div>

          <p className="login-brand-description">
            Welcome to the Meridian Kitchens
            staff portal. Manage inventory,
            monitor operations, and keep every
            outlet running smoothly.
          </p>

          <div className="login-brand-footer">
            <span>✦</span>
            Hospitality • Quality • Excellence
          </div>

        </div>


        {/* Login card */}

        <div className="login-card">

          <div className="login-card-header">

            <span className="login-label">
              STAFF PORTAL
            </span>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to access your dashboard
            </p>

          </div>


          {/* Error */}

          {errorMessage && (
            <div className="login-error">
              <span>!</span>
              {errorMessage}
            </div>
          )}


          {/* Username */}

          <div className="login-field">

            <label htmlFor="username">
              Username
            </label>

            <div className="login-input-wrapper">

              <span className="login-input-icon">
                ◉
              </span>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                autoComplete="username"
              />

            </div>

          </div>


          {/* Password */}

          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="login-input-wrapper">

              <span className="login-input-icon">
                ●
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>


          {/* Login button */}

          <button
            type="button"
            className="login-submit-button"
            onClick={handleLogin}
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="login-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <span>→</span>
              </>
            )}

          </button>


          {/* Security note */}

          <div className="login-security">

            <span>🔒</span>

            <p>
              Authorized Meridian staff only
            </p>

          </div>

        </div>

      </div>


      {/* Bottom copyright */}

      <div className="login-copyright">
        © 2026 Meridian Kitchens Collective
      </div>

    </div>
  );
}

export default StaffLogin;