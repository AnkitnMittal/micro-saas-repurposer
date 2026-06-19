import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const contentSchema = new Schema(
  {
    originalUrl: { type: String, required: true },
    platform: { type: String, required: true },
    generatedText: { type: String, required: true },
  },
  { timestamps: true },
);

const Content = mongoose.model('Content', contentSchema);
export default Content;
