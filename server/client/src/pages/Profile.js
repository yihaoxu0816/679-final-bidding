import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../App";
import { getUserById, getCurrentUser } from "../data/users";
import { getRooms, closeRoom, deleteRoom } from "../data/rooms";
import "./Profile.css";

function Profile() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRooms, setUserRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is logged in
        const loggedInUser = getCurrentUser();
        if (!loggedInUser) {
          navigate("/login");
          return;
        }

        // Fetch user data from backend
        const userData = await getUserById(loggedInUser.id);
        setUser(userData);

        // Fetch all rooms and filter by host
        const allRooms = await getRooms();
        const myRooms = allRooms.filter(room => room.hostId === loggedInUser.id);
        setUserRooms(myRooms);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setErrorMessage("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleCloseRoom = async (roomId, event) => {
    event.stopPropagation(); // Prevent navigation when clicking button
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await closeRoom(roomId);
      setSuccessMessage("Room closed successfully!");

      // Refresh user data to update balance and items won
      const loggedInUser = getCurrentUser();
      const updatedUser = await getUserById(loggedInUser.id);
      setUser(updatedUser);
      
      // Update current user in context with new balance
      setCurrentUser({
        ...currentUser,
        balance: updatedUser.balance,
        itemsWon: updatedUser.itemsWon
      });

      // Refresh rooms list
      const allRooms = await getRooms();
      const myRooms = allRooms.filter(room => room.hostId === loggedInUser.id);
      setUserRooms(myRooms);
    } catch (error) {
      setErrorMessage(error.message || "Failed to close room.");
    }
  };

  const handleEditRoom = (roomId, event) => {
    event.stopPropagation(); // Prevent navigation when clicking button
    navigate(`/rooms/${roomId}/edit`);
  };

  const handleRoomClick = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  const handleDeleteRoom = async (roomId, event) => {
    event.stopPropagation(); // Prevent navigation when clicking button
    
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }
    
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await deleteRoom(roomId);
      setSuccessMessage("Room deleted successfully!");

      // Refresh rooms list
      const allRooms = await getRooms();
      const myRooms = allRooms.filter(room => room.hostId === currentUser.id);
      setUserRooms(myRooms);
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete room.");
    }
  };


  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!user) {
    return <div className="profile-container">User not found.</div>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="profile-info-card">
        <h2>Account Information</h2>
        <div className="info-row">
          <span className="info-label">Username:</span>
          <span className="info-value">{user.username}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Current Balance:</span>
          <span className="info-value balance-value">${user.balance}</span>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2>Your Rooms</h2>
          <button className="create-room-button" onClick={() => navigate("/rooms/new")}>
            + Create a Room
          </button>
        </div>
        {userRooms.length === 0 ? (
          <p className="empty-message">You haven't created any rooms yet.</p>
        ) : (
          <div className="rooms-list">
            {userRooms.map((room) => (
              <div 
                key={room.id} 
                className="room-item"
                onClick={() => handleRoomClick(room.id)}
              >
                <div className="room-item-header">
                  <h3>{room.itemName}</h3>
                  <span className={`status-badge ${room.status === 'open' ? 'status-open' : 'status-closed'}`}>
                    {room.status.toUpperCase()}
                  </span>
                </div>
                <p className="room-item-description">{room.itemDescription}</p>
                <div className="room-item-info">
                  <span>Starting Price: ${room.startingPrice}</span>
                  <span>Current Bid: ${room.currentHighestBid}</span>
                </div>
                <div className="room-item-actions">
                  <div className="actions-left">
                    {room.status === 'open' && (
                      <button 
                        className="edit-button" 
                        onClick={(e) => handleEditRoom(room.id, e)}
                      >
                        Edit
                      </button>
                    )}
                    {room.status === 'open' && (
                      <button 
                        className="close-button" 
                        onClick={(e) => handleCloseRoom(room.id, e)}
                      >
                        Close This Room
                      </button>
                    )}
                  </div>
                  {room.status === 'open' && (
                    <button 
                      className="delete-button" 
                      onClick={(e) => handleDeleteRoom(room.id, e)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>Items Won</h2>
        {!user.itemsWon || user.itemsWon.length === 0 ? (
          <p className="empty-message">You haven't won any items yet.</p>
        ) : (
          <div className="items-won-list">
            {user.itemsWon.map((item, index) => (
              <div 
                key={index} 
                className="won-item-card"
                onClick={() => handleRoomClick(item.roomId)}
              >
                <h3>{item.itemName}</h3>
                <p>{item.itemDescription}</p>
                <div className="won-item-info">
                  <span className="won-amount">Winning Bid: ${item.amount}</span>
                  <span className="won-date">
                    Won on: {new Date(item.wonAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

