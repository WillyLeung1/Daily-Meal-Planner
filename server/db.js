import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });  // Load environment variables
const URI = process.env.MONGODB_URI || '';  // Ensure it uses the correct variable

// Connect to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,  // 60-second timeout
      socketTimeoutMS: 60000,           // 60-second socket timeout
    });
    console.log("Connected to MongoDB using Mongoose!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;  // Ensure the error is thrown for further handling
  }
}

export { connectToDatabase };
