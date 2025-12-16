import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getRoomsWithHostNames, updateRoom } from "../data/rooms";
import RoomCard from "../components/RoomCard";
import { API_URL } from "../data/api";
import { io } from "socket.io-client";

function Home() {
  const [ rooms, setRooms ] = useState([]);
  const navigate = useNavigate();
  console.log('in Home, rooms:', rooms);

  useEffect(() => {
    const fetchRooms = async () => {
      const rooms = await getRoomsWithHostNames(null);
      console.log('in Home useEffect, rooms were fetched:', rooms);
      setRooms(rooms);
    };
    fetchRooms();

    const socket = io(API_URL);

    socket.on('updateRoom', (roomId, updatedFields) => {
      console.log('updateRoom received', roomId, updatedFields);
      setRooms(rooms => rooms.map(r => 
        r.id === roomId ? { ...r, ...updatedFields } : r
      ));
    });
    
    return () => {
      socket.off('updateRoom');
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1 style={{ color: 'black' }}>All Rooms</h1>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room} 
            onClick={() => navigate(`/rooms/${room.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;