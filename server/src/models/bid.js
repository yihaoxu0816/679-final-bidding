class Bid {
    id = '';
    roomId = '';             // ID of the room this bid belongs to
    userId = '';             // ID of the user who placed the bid
    amount = 0;              // Bid amount
    timestamp = '';          // When the bid was placed

    constructor(bidFields) {
        const id = bidFields.id ?? String(Date.now());
        const timestamp = bidFields.timestamp ?? new Date().toISOString();
        this.updateProperties({id, timestamp, ...bidFields});
    }

    updateProperties(bidFields) {
        this.id = bidFields.id ?? this.id;
        this.roomId = bidFields.roomId ?? this.roomId;
        this.userId = bidFields.userId ?? this.userId;
        this.amount = bidFields.amount ?? this.amount;
        this.timestamp = bidFields.timestamp ?? this.timestamp;
    }

    static fromBidDocument = (bidDocument) => {
        const id = bidDocument._id.toString();
        if (!id) {
            throw new Error('Bid document has no id');
        }
        delete bidDocument._id;
        const bid = new Bid({id, ...bidDocument});
        return bid;
    }
}

export { Bid };

