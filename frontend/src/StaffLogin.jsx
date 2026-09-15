import { useState } from "react";
import axios from "axios";

function StaffLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

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
        alert("Invalid username or password");
      });
  };

  return (
    <div>
      <h1>🔐 Staff / Manager Login</h1>

      <div>
        <label>Username:</label>
        <br />
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label>Password:</label>
        <br />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default StaffLogin;