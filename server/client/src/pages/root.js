import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import '../index.css';
import { CurrentUserContext } from "../App";
import { logoutUser } from "../data/users";

function Root() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    navigate("/");
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-left">
          <Link to="/">Used Goods Bidding Market</Link>
        </div>
        <div className="App-header-right">
          {currentUser && 
            <>
              <Link to="/profile" className="profile-link">
                <span className="user-info">
                  <span className="username">{currentUser.username}</span>
                  <span className="balance">Balance: ${currentUser.balance}</span>
                </span>
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          }
          {!currentUser && <Link to="/login">Login</Link>}
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default Root;
