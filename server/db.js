import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });  
const URI = process.env.MONGODB_URI || '';  // Error check

// Connect to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,  // 60-seconds
      socketTimeoutMS: 60000,           
    });
    console.log("Connected to MongoDB using Mongoose!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err; 
  }
}

export { connectToDatabase };
