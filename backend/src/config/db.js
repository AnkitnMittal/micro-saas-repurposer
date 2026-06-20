import mongoose from 'mongoose';

export const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((res) => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.log('Error connecting to MongoDB', error);
      process.exist(1);
    });
};
