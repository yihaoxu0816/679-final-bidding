import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { CurrentUserContext } from "../App";
import { loginUser, registerUser } from "../data/users";

function Login() {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleLogin = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      
      const user = await loginUser(username, password);
      if (user) {
        setCurrentUser(user);
        navigate("/");
      } else {
        setErrorMessage("Error validating login.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      
      await registerUser(username, password);
      setSuccessMessage("Registration successful! You can now login.");
      setIsRegisterMode(false);
      setPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="content-container">
      <h1>{isRegisterMode ? "Register" : "Login"}</h1>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      
      <div className="login-form">
        <label htmlFor="username">Username</label>
        <input 
          type="text" 
          name="username" 
          id="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required
        />
        
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          name="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button onClick={isRegisterMode ? handleRegister : handleLogin}>
          {isRegisterMode ? "Register" : "Login"}
        </button>
        
        <p className="toggle-mode">
          {isRegisterMode ? (
            <>
              Already have an account?{" "}
              <span 
                className="toggle-link" 
                onClick={() => {
                  setIsRegisterMode(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span 
                className="toggle-link" 
                onClick={() => {
                  setIsRegisterMode(true);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                Register here
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
