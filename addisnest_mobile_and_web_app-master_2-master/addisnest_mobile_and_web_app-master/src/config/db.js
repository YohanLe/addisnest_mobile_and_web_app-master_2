const mongoose = require('mongoose');

// Disable Mongoose buffering globally
mongoose.set('bufferCommands', false);

// Database connection with retry logic
const connectDB = async (retryCount = 0) => {
  const maxRetries = 5;
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Use only supported options
      serverSelectionTimeoutMS: 30000, // Reduce to 30 seconds for faster failure detection
      socketTimeoutMS: 45000, // Reduce socket timeout to 45 seconds
      connectTimeoutMS: 30000, // Reduce connection timeout to 30 seconds
      maxPoolSize: 5, // Reduce pool size to avoid connection overhead
      minPoolSize: 1, // Maintain at least 1 connection
      bufferCommands: false, // Disable mongoose buffering for commands
      maxIdleTimeMS: 60000, // Keep connections alive longer (60 seconds)
      retryWrites: true, // Enable retryable writes
      retryReads: true, // Enable retryable reads
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database connection stable: ${mongoose.connection.readyState === 1 ? 'Yes' : 'No'}`);
    
    // Set up connection event listeners for monitoring
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected - attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });
    
    mongoose.connection.on('connecting', () => {
      console.log('MongoDB connecting...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });
    
    // Monitor connection stability
    setInterval(() => {
      const state = mongoose.connection.readyState;
      const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      console.log(`Database connection status: ${stateNames[state] || 'unknown'} (${state})`);
    }, 30000); // Check every 30 seconds
    
  } catch (error) {
    console.error(`MongoDB connection attempt ${retryCount + 1} failed: ${error.message}`);
    
    if (retryCount < maxRetries) {
      console.log(`Retrying connection in 5 seconds... (${retryCount + 1}/${maxRetries})`);
      setTimeout(() => connectDB(retryCount + 1), 5000);
    } else {
      console.error('Max connection retries reached. Exiting...');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
