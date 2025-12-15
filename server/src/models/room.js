class Room {
    id = '';
    itemName = '';           // Name of the item being auctioned
    itemDescription = '';    // Description of the item
    startingPrice = 0;       // Minimum starting bid
    hostId = '';             // User ID of the room creator
    currentHighestBid = 0;   // Current highest bid amount
    currentHighestBidder = null;  // User ID of current highest bidder (null if no bids)
    status = 'open';         // 'open' or 'closed'
    createdAt = '';
    closedAt = null;         // Timestamp when room was closed

    constructor(roomFields) {
        const id = roomFields.id ?? String(Date.now());
        const createdAt = roomFields.createdAt ?? new Date().toISOString();
        const currentHighestBid = roomFields.currentHighestBid ?? roomFields.startingPrice ?? 0;
        this.updateProperties({id, createdAt, currentHighestBid, ...roomFields});
    }

    updateProperties(roomFields) {
        this.id = roomFields.id ?? this.id;
        this.itemName = roomFields.itemName ?? this.itemName;
        this.itemDescription = roomFields.itemDescription ?? this.itemDescription;
        this.startingPrice = roomFields.startingPrice ?? this.startingPrice;
        this.hostId = roomFields.hostId ?? this.hostId;
        this.currentHighestBid = roomFields.currentHighestBid ?? this.currentHighestBid;
        this.currentHighestBidder = roomFields.currentHighestBidder ?? this.currentHighestBidder;
        this.status = roomFields.status ?? this.status;
        this.createdAt = roomFields.createdAt ?? this.createdAt;
        this.closedAt = roomFields.closedAt ?? this.closedAt;
    }

    static fromRoomDocument = (roomDocument) => {
        const id = roomDocument._id.toString();
        if (!id) {
            throw new Error('Room document has no id');
        }
        delete roomDocument._id;
        const room = new Room({id, ...roomDocument});
        return room;
    }
}

export { Room };

