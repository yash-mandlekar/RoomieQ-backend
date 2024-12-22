const mongoose = require('mongoose');

const roommateFormSchema = new mongoose.Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    name: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    hometown: { type: String, required: true },
    roomPreference: { type: String, required: true }, // e.g., "Single", "Shared"
    languagePreference: { type: String, required: true },
    images: { type: [String], default: []}, 
    genderPreference: { type: String, enum: ['Male', 'Female', 'Any'], required: true },
    occupation: { type: String, required: true },
    moveInDate: { type: String, required: true }, // e.g., "Immediate", "Next Month"
    locationPreference: { type: String, required: true },
    interests: [{ type: String }], // Array of interests
    description: { type: String },    
    isApproved: { type: Boolean, default: false },
    FeatureListing: {type: Boolean, required: true, default: false},
    distance: { type: Number }, 
    type: { type: String, default: 'Roommate' }    
}, { timestamps: true });

module.exports = mongoose.model('RoommateForm', roommateFormSchema);
