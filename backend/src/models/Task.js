import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    sourceUrl: { type: String, required: true },
    targetPlatform: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
    },
    errorLog: { type: String },
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
