import express from 'express';
import { submitTask, getTaskStatus } from '../controllers/taskController.js';

const router = express.Router();

router.post('/repurpose', submitTask);
router.get('/:id', getTaskStatus);

export default router;
