# Used Goods Bidding Market

A full-stack real-time bidding platform built with Node.js, Express, React, MongoDB, and Socket.IO.

## Deployed Site

**Live Demo:** [http://34.61.176.150:6790](http://34.61.176.150:6790)

⚠️ **Note:** User authentication is not working on the deployed site, so most features (login, bidding, creating rooms) will not be functional. To experience the full application, please set it up locally following the **Local Setup Guide** below.

## How to Use the Application

### Getting Started

1. **Register an Account**
   - Click "Login" in the top navigation bar
   - Click "Register" to create a new account
   - Enter a username and password
   - New users start with a balance of $10,000

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

Before you begin, make sure you have installed:
- **Node.js** 
- **MongoDB** 
- **npm** 

## Local Setup Guide

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd 679-final-bidding
```

### Step 2: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Start MongoDB

In a separate terminal window:

```bash
mongod
```

Keep this terminal running while you use the application.

### Step 4: Generate JWT Keys

JWT keys are required for user authentication. Generate them in the `server/` directory:

```bash
cd server
ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key -N ""
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
```

This creates two files:
- `jwt.key` - Private key
- `jwt.key.pub` - Public key

### Step 5: Configure Environment Variables

#### Server `.env` File

Create a file named `.env` in the `server/` directory:

```bash
cd server
touch .env
```

Open the file and add the following configuration:

```env
MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=bidding-platform
PORT=6790
NODE_ENV=development

JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIJKAIBAAKCAgEA1+uXxvyykZ+xekrFxebqOQSKJ+VP...
[Copy the ENTIRE contents of jwt.key here, including all lines]
...qeA7Hn0U+h5Zhyr2ZFilBCWE4tgiGyowCXlxvbnPcENN6JberrNz4atkt+4=
-----END RSA PRIVATE KEY-----"

JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAG8AMIICCgKCAgEA1+uXxvyykZ+xekrFxebq...
[Copy the ENTIRE contents of jwt.key.pub here, including all lines]
...+YtAeMP2Zq56k0rYFVCFFR0CAwEAAQ==
-----END PUBLIC KEY-----"
```

#### Client `.env` File

The client folder is located at `server/client/`. Create a `.env` file there:

```bash
cd server/client
touch .env
```

Add the following content:

```env
REACT_APP_API_URL=http://localhost:6790
```

### Step 6: Build the Frontend

Build the React application:

```bash
cd server/client
npm run build
```

This creates a production build in `server/client/build/` that will be served by the backend.

### Step 7: Run the Application

You'll need **two** terminal windows:

#### Terminal 1: MongoDB
```bash
mongod
```

#### Terminal 2: Backend Server
```bash
cd server
npm start
```

The server will start at `http://localhost:6790`

### Step 8: Access the Application

Open your browser and go to:
```
http://localhost:6790
```

The backend server serves both the API and the React frontend.

## Running the App

Access the application at:
- **Frontend & Backend**: `http://localhost:6790`
- **API Endpoints**: `http://localhost:6790/api/*`

The backend server serves both the React frontend and handles all API requests.

## Project Structure

```
679-final-bidding/
├── server/
│   ├── client/              # React frontend (inside server for deployment)
│   │   ├── src/
│   │   ├── public/
│   │   ├── build/           # Production build (created by npm run build)
│   │   ├── .env             # Client environment variables
│   │   └── package.json
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication, error handling
│   │   ├── db/              # Database connection
│   │   └── server.js        # Main server file
│   ├── .env                 # Server environment variables (create this!)
│   ├── jwt.key              # Private key (create this!)
│   ├── jwt.key.pub          # Public key (create this!)
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user (requires JWT)
- `DELETE /api/users/:id` - Delete user

### Rooms (Bidding Items)
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create new room (requires JWT)
- `PATCH /api/rooms/:id` - Update room (requires JWT)
- `POST /api/rooms/:id/close` - Close room (requires JWT)
- `DELETE /api/rooms/:id` - Delete room (requires JWT)

### Bids
- `GET /api/bids/room/:roomId` - Get all bids for a room
- `POST /api/bids/room/:roomId` - Place a bid (requires JWT)

## Security Notes

**DO NOT commit these files to Git:**
- `.env` files (contain secrets)
- `jwt.key` and `jwt.key.pub` (authentication keys)
- `node_modules/` (dependencies)

These are already listed in `.gitignore` to prevent accidental commits.

## Features

- ✅ User registration and authentication (JWT)
- ✅ Real-time bidding updates (Socket.IO)
- ✅ Create and manage bidding rooms
- ✅ Place bids on items
- ✅ User profiles with balance tracking
- ✅ Bidding history
- ✅ Room status management (open/closed)
- ✅ Winner determination when room closes

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
