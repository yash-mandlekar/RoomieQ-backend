const Consultation = require('../models/Consultation');

// Create consultation logic
const CreateConsultation = async (req, res) => {
    const { Name, Email, PhoneNo, Uid } = req.body;

    try {
        const newConsultation = new Consultation({
            Name,
            Email,
            PhoneNo,
            Uid
        });

        await newConsultation.save();

        res.status(201).json({
            message: 'Consultation created successfully',
            consultation: newConsultation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Make sure to export the correct function name
module.exports = {
    CreateConsultation // Changed to match the export name
};
