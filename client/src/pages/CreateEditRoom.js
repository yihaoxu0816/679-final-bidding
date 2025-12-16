import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoom, createRoom, updateRoom } from "../data/rooms";
import { getCurrentUser } from "../data/users";
import "./CreateEditRoom.css";

function CreateEditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = getCurrentUser();
    if (!loggedInUser) {
      navigate("/login");
      return;
    }

    // If edit mode, fetch room data
    if (isEditMode) {
      const fetchRoom = async () => {
        setLoading(true);
        try {
          const roomData = await getRoom(id);
          setItemName(roomData.itemName);
          setItemDescription(roomData.itemDescription);
          setStartingPrice(roomData.startingPrice.toString());
        } catch (error) {
          setErrorMessage("Failed to load room data.");
        } finally {
          setLoading(false);
        }
      };
      fetchRoom();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (!itemName.trim()) {
      setErrorMessage("Item name is required.");
      return;
    }
    if (!itemDescription.trim()) {
      setErrorMessage("Item description is required.");
      return;
    }
    const price = parseFloat(startingPrice);
    if (!price || price <= 0) {
      setErrorMessage("Starting price must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        // Update existing room
        await updateRoom(id, {
          itemName,
          itemDescription,
          startingPrice: price
        });
      } else {
        // Create new room
        await createRoom({
          itemName,
          itemDescription,
          startingPrice: price
        });
      }

      // Navigate back to profile
      navigate("/profile");
    } catch (error) {
      setErrorMessage(error.message || `Failed to ${isEditMode ? 'update' : 'create'} room.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="create-edit-room-container">
      <h1>{isEditMode ? "Edit Room" : "Create a New Room"}</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="room-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name *</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g., Vintage Camera"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="itemDescription">Item Description *</label>
          <textarea
            id="itemDescription"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Describe your item in detail..."
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startingPrice">Starting Price ($) *</label>
          <input
            type="number"
            id="startingPrice"
            value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)}
            placeholder="e.g., 50"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Saving..." : (isEditMode ? "Update Room" : "Create Room")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEditRoom;

