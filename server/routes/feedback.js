import { Router } from 'express';
import { sendFeedbackEmail } from '../utils/email.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Send email only (no DB)
    try {
      await sendFeedbackEmail({ name, email, message });
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
    }

    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
