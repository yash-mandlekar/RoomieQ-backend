// controllers/feedbackController.js

const AboutFeedback = require('../models/AboutFeedback'); // Ensure this path is correct

// Submit feedback logic
const submitFeedback = async (req, res) => {
    const { Uid, Feedback } = req.body;

    try {
        const newFeedback = new AboutFeedback({
            Uid,
            Feedback
        });

        await newFeedback.save();

        res.status(201).json({
            message: 'Feedback submitted successfully',
            feedback: newFeedback
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    submitFeedback
};
