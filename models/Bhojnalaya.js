const mongoose = require('mongoose');

const bhojnalayaSchema = new mongoose.Schema({
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bhojanalayName: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    monthlyCharge1: { type: Number, required: true },
    monthlyCharge2: { type: Number, required: true },
    timings: { type: String, required: true },
    priceOfThali: { type: String },
    images: { type: [String], default: []},    
    parcelOfFood: { type: String, default: false },
    veg: { type: String, required: true },
    amenities: { type: [String], default: [] }, // Array of amenities
    parking: { type: String, default: false },
    specialThali: { type: String, default: false },    
    description: { type: String },
    isApproved: { type: Boolean, default: false },
    FeatureListing: {type: Boolean, required: true, default: false},   
    distance: { type: Number },  
    type: { type: String, default: 'Bhojnalaya' }
}, { timestamps: true });

module.exports = mongoose.model('Bhojnalaya', bhojnalayaSchema);
