# Used Goods Bidding Market

A full-stack real-time bidding platform built with Node.js, Express, React, MongoDB, and Socket.IO.

> **📌 Note:** This is the **local development version** of the application. It is designed to run on your local machine only, with the frontend at `http://localhost:3000` and backend at `http://localhost:6790`. For the production-ready version with GCP deployment support, please see the `deploy` branch.


## How to Use the Application

### Getting Started

1. **Register an Account**
   - Click "Login" in the top navigation bar
   - Click "Register" to create a new account
   - Enter a username and password
   - New users start with a balance of $100

2. **Browse Bidding Rooms**
   - The home page displays all available bidding rooms
   - Each room shows:
     - Host's name
     - Item name and description
     - Starting price
     - Current highest bid
     - Status (OPEN or CLOSED)
   - Click on any room card to view details

3. **View Room Details & Bid**
   - See full item description and bidding history
   - Place a bid higher than the current highest bid
   - Your balance will be checked before placing a bid
   - Watch real-time updates as other users bid
   - Note: You cannot bid on your own rooms

4. **Create a New Room**
   - Go to your Profile page (click your username in top bar)
   - Click "Create a Room" button
   - Fill in:
     - Item name
     - Item description
     - Starting price
   - Your new room will appear on the home page

5. **Manage Your Rooms**
   - In your Profile, view all rooms you've hosted
   - **Edit**: Modify room details (only for OPEN rooms)
   - **Close**: End bidding and declare a winner
   - **Delete**: Remove a room (only for OPEN rooms)
   - Once closed, the highest bidder wins the item

6. **Track Your Activity**
   - **Balance**: Shows your current bidding balance (top bar)
   - **Your Rooms**: All items you've put up for bidding
   - **Items Won**: All auctions where you were the highest bidder when the room closed

### Key Features
- ✅ **Real-time Updates**: See new bids instantly without refreshing
- ✅ **Balance Management**: Track your spending across all bids
- ✅ **Bidding History**: View all bids placed on an item
- ✅ **Room Management**: Full control over your hosted auctions
- ✅ **Winner Determination**: Automatic winner selection when rooms close

## Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- npm (v9+)

## Project Structure

```
679-final-bidding/
├── client/          # React frontend (separate directory)
│   ├── src/
│   ├── public/
│   ├── .env        # Frontend environment variables
│   └── package.json
├── server/          # Node.js backend (separate directory)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   ├── .env        # Backend environment variables
│   └── package.json
└── README.md
```

## Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Environment Configuration

### 1. Generate JWT Keys

JWT keys are required for user authentication. Generate them in the `server/` directory:

```bash
cd server
ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key -N ""
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
```

This creates two files:
- `jwt.key` - Private key for signing tokens
- `jwt.key.pub` - Public key for verifying tokens

### 2. Create Environment Files

#### Server `.env` (in `server/` directory)

Create a `.env` file with the following:

```env
MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=bidding-platform
PORT=6790
NODE_ENV=development
```

Then add your JWT keys (copy the entire contents of the key files):

```bash
# View your private key
cat jwt.key

# View your public key
cat jwt.key.pub
```

Add them to `.env`:

```env
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIJKAIBAAKCAgEA...
[Copy ENTIRE contents of jwt.key here]
...ending=
-----END RSA PRIVATE KEY-----"

JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0...
[Copy ENTIRE contents of jwt.key.pub here]
...Q==
-----END PUBLIC KEY-----"
```

**Important**: The keys must be wrapped in quotes and include all lines (including BEGIN/END lines).

#### Client `.env` (in `client/` directory)

Create a `.env` file with:

```env
REACT_APP_API_URL=http://localhost:6790
```

## Running the Application

**This application requires 3 terminal windows to run:**

### Terminal 1: Start MongoDB

```bash
mongod
```

Keep this running in the background.

### Terminal 2: Start Backend Server

```bash
cd server
npm start
```

Backend runs at `http://localhost:6790`

### Terminal 3: Start Frontend

```bash
cd client
npm start
```

Frontend runs at `http://localhost:3000`

### Access the Application

Open your browser and go to: **`http://localhost:3000`**

The frontend will proxy API requests to the backend at `http://localhost:6790`.

## Run Tests

## API Endpoints

Backend server runs on `http://localhost:6790`

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user (requires JWT)
- `DELETE /users/:id` - Delete user

### Rooms (Bidding Items)
- `GET /rooms` - Get all rooms
- `GET /rooms/:id` - Get room by ID
- `GET /rooms/host/:hostId` - Get rooms by host ID
- `POST /rooms` - Create new room (requires JWT)
- `PATCH /rooms/:id` - Update room (requires JWT)
- `POST /rooms/:id/close` - Close room (requires JWT)
- `DELETE /rooms/:id` - Delete room (requires JWT)

### Bids
- `GET /bids/room/:roomId` - Get all bids for a room
- `GET /bids/user/:userId` - Get all bids by a user
- `POST /bids/room/:roomId` - Place a bid (requires JWT)

## Technologies Used

### Backend
- Node.js + Express.js
- MongoDB (database)
- Socket.IO (real-time updates)
- JWT (authentication)
- bcrypt (password hashing)

### Frontend
- React
- React Router (client-side routing)
- Socket.IO Client (real-time updates)

## Security Notes

**DO NOT commit these files to Git:**
- `.env` files (contain secrets and configuration)
- `jwt.key` and `jwt.key.pub` (authentication keys)
- `node_modules/` (dependencies)

These are already listed in `.gitignore` to prevent accidental commits.
