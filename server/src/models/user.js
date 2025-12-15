class User {
    id = '';
    username = '';
    password = '';
    balance = 100;           // Starting balance for bidding
    itemsWon = [];           // Array of item objects won through bidding

    constructor(userFields) {
        const id = userFields.id ?? String(Date.now());
        this.updateProperties({id, ...userFields});
    }

    updateProperties(userFields) {
        this.id = userFields.id ?? this.id;
        this.username = userFields.username ?? this.username;
        this.password = userFields.password ?? this.password;
        this.balance = userFields.balance ?? this.balance;
        this.itemsWon = userFields.itemsWon ?? this.itemsWon;
    }

    static fromUserDocument = (userDocument) => {
        const id = userDocument._id.toString();
        if (!id) {
            throw new Error('User document has no id');
        }
        delete userDocument._id;
        const user = new User({id, ...userDocument});
        return user;
    }
}

export { User };