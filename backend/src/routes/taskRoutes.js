import express from 'express';
import { repurposeContent, getTask } from '../controllers/taskController.js';
const router = express.Router();

router.post('/repurpose', repurposeContent);
router.get('/:id', getTask);

export default router;
