import mongoose from 'mongoose';

const connectDB = () => {
  mongoose
    .connect(DB_URI)
    .then((res) => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.log('Error connecting to MongoDB', error);
      process.exist(1);
    });
};

export default connectDB;
