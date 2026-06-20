import Task from '../models/Task.js';

export const submitTask = async (req, res) => {
  try {
    const { url, platformTarget } = req.body;

    const newTask = await Task.create({
      sourceUrl: url,
      targetPlatform: platformTarget,
    });

    /**
     * Add Job to BullMQ Redis Queue
     * Return a 202 Accepted status and the task ID to the client
     */

    res.status(202).json({
      message: 'Task accepted for processing',
      taskId: newTask._id,
      status: newTask.status,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
