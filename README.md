# Used Goods Bidding Market

A full-stack real-time bidding platform built with Node.js, Express, React, MongoDB, and Socket.IO.

## Prerequisites

- Node.js
- MongoDB
- npm

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

Generate RSA keys for JWT authentication:

```bash
cd server
ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key -N ""
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
```

This creates two files: `jwt.key` (private key) and `jwt.key.pub` (public key).

### 2. Update `.gitignore`

Ensure your `server/.gitignore` includes:

```
node_modules
.env
coverage
*.pem
*.cert
*.key
*.pub
.DS_Store
```

### 3. Create Server `.env` File

Create a file named `.env` in the `server/` directory:

```bash
cd server
nano .env  # or use any text editor
```

Add the following content, **copying the entire contents of your generated JWT keys**:

```env
MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=bidding-platform
PORT=6790
NODE_ENV=production

JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
[paste entire contents of jwt.key here, preserving line breaks]
-----END RSA PRIVATE KEY-----"

JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
[paste entire contents of jwt.key.pub here, preserving line breaks]
-----END PUBLIC KEY-----"
```

**Important:** 
- Include the quotes around the key values
- Preserve all line breaks and formatting from the key files
- Include the BEGIN/END header lines

**Note:** Currently, MongoDB settings are hardcoded in `src/db/db.js`. The .env file is optional unless you uncomment the environment variable code in that file.

### 4. Create Client `.env` File

Create a file named `.env` in the `client/` directory:

```bash
cd client
nano .env  # or use any text editor
```

Add the following content:

```env
# For local development
REACT_APP_API_URL=http://localhost:6790

# For production, replace with your VM's external IP
# REACT_APP_API_URL=http://<your-vm-ip>:6790
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




