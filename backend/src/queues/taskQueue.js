import { Queue } from 'bullmq';
import redisConnection from '../config/redis.js';

export const repurposeQueue = new Queue('repurpose-content', {
  connection: redisConnection,
});
