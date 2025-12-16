import React from 'react';
import './RoomCard.css';

/**
 * RoomCard component for displaying a bidding room in a grid layout
 * @param {Object} room - The room object to display
 * @param {Function} onClick - Optional click handler for the card
 */
function RoomCard({ room, onClick }) {
  const statusClass = room.status === 'open' ? 'status-open' : 'status-closed';

  return (
    <div className="room-card" onClick={onClick}>
      <div className={`room-card-status ${statusClass}`}>
        {room.status.toUpperCase()}
      </div>
      
      <div className="room-card-content">
        <h3 className="room-card-host">{room.hostName || 'Unknown Host'}'s Room</h3>
        
        <h2 className="room-card-title">{room.itemName}</h2>
        
        <p className="room-card-description">
          {room.itemDescription}
        </p>
        
        <div className="room-card-prices">
          <div className="price-item">
            <span className="price-label">Starting Price:</span>
            <span className="price-value">${room.startingPrice}</span>
          </div>
          
          <div className="price-item">
            <span className="price-label">Current Highest Bid:</span>
            <span className="price-value price-highlight">
              ${room.currentHighestBid}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;

