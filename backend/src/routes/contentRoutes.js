import express from 'express';
import {
  getAllContent,
  getContentById,
  deleteContent,
} from '../controllers/contentController.js';
const router = express.Router();

router.get('/', getAllContent);
router.get('/:id', getContentById);
router.delete('/:id', deleteContent);

export default router;
