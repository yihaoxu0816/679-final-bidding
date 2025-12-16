# Used Goods Bidding Market

A full-stack real-time bidding platform built with Node.js, Express, React, MongoDB, and Socket.IO.

## Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- npm (v9+)

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

### Server `.env` (in `server/` directory)

```env
MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=bidding-platform
PORT=6790
NODE_ENV=production
```

### Client `.env` (in `client/` directory)

```env
# Local development
REACT_APP_API_URL=http://localhost:6790

# Production (update with your VM IP)
REACT_APP_API_URL=http://<your-vm-ip>:6790
```

## Build

```bash
cd client
npm run build
```

## Run Locally

```bash
# Start MongoDB
mongod

# Start backend (in server/)
npm start

# Start frontend (in client/)
npm start
```

Access at `http://localhost:3000`

## Run Tests

```bash
cd server
npm test
npm test -- --coverage  # with coverage report
```

## Deploy to Google Cloud VM

### 1. Create VM and Configure Firewall

```bash
gcloud compute instances create bidding-platform --zone=us-central1-a --machine-type=e2-medium --image-family=ubuntu-2204-lts --image-project=ubuntu-os-cloud
gcloud compute firewall-rules create allow-app --allow tcp:3000,tcp:6790
```

### 2. SSH and Install Dependencies

```bash
gcloud compute ssh bidding-platform --zone=us-central1-a

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2
```

### 3. Deploy Application

```bash
# Clone and install
git clone <repository-url>
cd 679-final-bidding

cd server
npm install
# Create .env file with production settings

cd ../client
npm install
# Update .env with VM IP
npm run build
```

### 4. Start with PM2

```bash
# Start backend
cd server
pm2 start src/server.js --name bidding-backend

# Start frontend
cd ../client
pm2 serve build 3000 --name bidding-frontend --spa

# Save and enable on boot
pm2 save
pm2 startup
```

Access at `http://<your-vm-ip>:3000`

## API Endpoints

- **Auth**: `POST /auth/register`, `POST /auth/login`
- **Users**: `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`
- **Rooms**: `GET /rooms`, `GET /rooms/:id`, `POST /rooms`, `PATCH /rooms/:id`, `POST /rooms/:id/close`, `DELETE /rooms/:id`
- **Bids**: `GET /bids/room/:roomId`, `POST /bids/room/:roomId`

## Troubleshooting

```bash
# Check PM2 status
pm2 status
pm2 logs

# Restart services
pm2 restart all

# Check MongoDB
sudo systemctl status mongod
```
