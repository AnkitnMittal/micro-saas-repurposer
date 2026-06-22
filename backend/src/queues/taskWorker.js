import { Worker } from 'bullmq';
import redisConnection from '../config/redis.js';
import Task from '../models/Task.js';
import { getIO } from '../config/socket.js';

export const worker = new Worker(
  'repurpose-content',
  async (job) => {
    const { taskId, url, platformTarget } = job.data;
    console.log(`[Worker] Picked up job ${job.id} for Task ID: ${taskId}`);

    try {
      await Task.findByIdAndUpdate(taskId, { status: 'processing' });

      const io = getIO();
      io.emit('taskProcessing', { taskId });

      console.log(`[Worker] Scraping ${url}...`);
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const mockGeneratedContent = `This is a mock generated content for ${platformTarget}`;

      await Task.findByIdAndUpdate(taskId, { status: 'completed' });

      io.emit('taskCompleted', {
        taskId,
        content: mockGeneratedContent,
      });

      console.log(`[Worker] Completed job ${job.id}`);
    } catch (error) {
      console.log(`[Worker] Job failed: ${error.message}`);
      await Task.findByIdAndUpdate(taskId, {
        status: 'failed',
        errorLog: error.message,
      });
      getIO().emit('taskFailed', { taskId, error: error.message });

      throw error;
    }
  },
  { connection: redisConnection },
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});
