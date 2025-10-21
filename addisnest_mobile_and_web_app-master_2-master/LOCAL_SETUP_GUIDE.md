# Addisnest App - Local Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally OR MongoDB Atlas account
- Git

## Quick Start Steps

### 1. Navigate to Project Directory
```bash
cd addisnest_mobile_and_web_app-master
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the project root by copying the example:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Essential Variables
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/addinest_real_estate
JWT_SECRET=your_random_secret_key_here_change_this
JWT_EXPIRE=30d

# Email (Optional for testing)
SENDGRID_API_KEY=your_sendgrid_key_or_leave_empty
EMAIL_FROM=contact@addisnest.com

# File Uploads
MAX_FILE_SIZE=5000000
FILE_UPLOAD_PATH=./uploads
FILE_UPLOAD_BASE_URL=http://localhost:5000/uploads
```

### 4. Start MongoDB
If using local MongoDB:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# or
sudo service mongod start
```

If using MongoDB Atlas, update `MONGO_URI` in `.env` with your connection string.

### 5. Run the Application
```bash
npm run dev
```

This command starts both:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:5173`

### 6. Access the App
Open your browser and navigate to:
```
http://localhost:5173
```

## Alternative: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

## Troubleshooting

### Port Already in Use
Kill existing processes on ports:
```bash
npm run kill-ports
```

### MongoDB Connection Issues
- Verify MongoDB is running: `mongosh` or check MongoDB Compass
- Check `MONGO_URI` in `.env` file
- For Atlas: Ensure IP whitelist includes your IP

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## Building for Production
```bash
npm run build
```

Build output will be in the `dist/` folder.

## Need Help?
Check the documentation in the `md files/` directory for detailed guides on specific features.
