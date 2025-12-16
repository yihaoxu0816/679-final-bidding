import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getRoom, getBidsForRoom, placeBid } from "../data/rooms";
import { getUsers } from "../data/users";
import { API_URL } from "../data/api";
import "./BiddingRoom.css";

function BiddingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState("Unknown Host");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomData = await getRoom(id);
        setRoom(roomData);

        // Get users for host name and bid usernames
        const usersData = await getUsers();
        setUsers(usersData);
        
        const host = usersData.find(u => u.id === roomData.hostId);
        setHostName(host?.username || "Unknown Host");

        // Get bidding history
        const bidsData = await getBidsForRoom(id);
        setBids(bidsData);
      } catch (error) {
        console.error("Failed to fetch room data:", error);
        setErrorMessage("Failed to load room data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();

    const socket = io(API_URL);

    socket.on('addBid', (bid) => {
      console.log('addBid received', bid);
      // Only update if the bid is for this room
      if (bid.roomId === id) {
        setBids(bids => [bid, ...bids]);
      }
    });

    socket.on('updateRoom', (roomId, updatedFields) => {
      console.log('updateRoom received', roomId, updatedFields);
      if (roomId === id) {
        setRoom(room => ({ ...room, ...updatedFields }));
      }
    });

    return () => {
      socket.off('addBid');
      socket.off('updateRoom');
      socket.disconnect();
    };
  }, [id]);

  const handlePlaceBid = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const amount = parseFloat(bidAmount);
      if (!amount || amount <= 0) {
        setErrorMessage("Please enter a valid bid amount.");
        return;
      }

      if (amount <= room.currentHighestBid) {
        setErrorMessage(`Bid must be higher than current highest bid of $${room.currentHighestBid}`);
        return;
      }

      await placeBid(id, amount);
      setSuccessMessage("Bid placed successfully!");
      setBidAmount("");

      // Refresh room and bids data
      const updatedRoom = await getRoom(id);
      setRoom(updatedRoom);
      const updatedBids = await getBidsForRoom(id);
      setBids(updatedBids);
      
      // Refresh users in case new user placed a bid
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
    } catch (error) {
      setErrorMessage(error.message || "Failed to place bid.");
    }
  };

  if (loading) {
    return <div className="bidding-room-container">Loading...</div>;
  }

  if (!room) {
    return <div className="bidding-room-container">Room not found.</div>;
  }

  return (
    <div className="bidding-room-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back to All Rooms
      </button>

      <div className="room-detail-card">
        <div className={`room-status-badge ${room.status === 'open' ? 'status-open' : 'status-closed'}`}>
          {room.status.toUpperCase()}
        </div>

        <p className="room-host">{hostName}'s Room</p>
        <h1 className="room-title">{room.itemName}</h1>
        <p className="room-description">{room.itemDescription}</p>

        <div className="price-section">
          <div className="price-box">
            <span className="price-label">Starting Price</span>
            <span className="price-amount">${room.startingPrice}</span>
          </div>
          <div className="price-box highlight">
            <span className="price-label">Current Highest Bid</span>
            <span className="price-amount">${room.currentHighestBid}</span>
          </div>
        </div>

        {room.status === 'open' && (
          <div className="bid-form">
            <h3>Make Your Bid</h3>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            
            <div className="bid-input-group">
              <span className="dollar-sign">$</span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid amount"
                min={room.currentHighestBid + 1}
                step="0.01"
              />
              <button onClick={handlePlaceBid}>Place Bid</button>
            </div>
          </div>
        )}

        {room.status === 'closed' && (
          <div className="room-closed-message">
            This room is closed. No more bids can be placed.
          </div>
        )}
      </div>

      <div className="bidding-history-section">
        <h2>Bidding History</h2>
        {bids.length === 0 ? (
          <p className="no-bids">No bids yet. Be the first to bid!</p>
        ) : (
          <div className="bids-list">
            {bids.map((bid) => {
              const bidder = users.find(u => u.id === bid.userId);
              const bidderName = bidder?.username || 'Unknown User';
              
              return (
                <div key={bid.id} className="bid-card">
                  <div className="bid-amount">${bid.amount}</div>
                  <div className="bid-details">
                    <span className="bid-user">{bidderName}</span>
                    <span className="bid-time">{new Date(bid.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BiddingRoom;

