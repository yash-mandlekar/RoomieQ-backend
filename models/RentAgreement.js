const mongoose = require('mongoose');

const rentAgreementSchema = new mongoose.Schema({
    OwnerName: { type: String, required: true },
    OwnerNumber: { type: String, required: true },
    OwnerAddress: { type: String, required: true },
    TenantName: { type: String, required: true },
    TenantAddress: { type: String, required: true },
    TenantPhoneNo: { type: String, required: true },
    PropertyState: { type: String, required: true },
    PropertyCity: { type: String, required: true },
    PropertyPincode: { type: String, required: true },
    PropertyLocalAddress: { type: String, required: true },
    MonthlyRent: { type: Number, required: true },
    SecurityDeposit: { type: Number, required: true },
    LockInPeriod: { type: String, required: true },
    NoticePeriod: { type: String, required: true },
    AgreementValidity: { type: String, required: true },
    AgreementStartDate: { type: Date, required: true },
    CreatedBy: { type: String, required: true },
    EmailAddress: { type: String, required: true },
    ItemsProvided: [
        {
            itemName: { type: String, required: true },
            itemQuantity: { type: Number, required: true }
        }
    ],
    Uid: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('RentAgreement', rentAgreementSchema);
