import mongoose from "mongoose";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to the database");
    return;
  }
  console.log("Connecting to the database...");
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Successfully connected to the database");
};

export default connectToDatabase;
