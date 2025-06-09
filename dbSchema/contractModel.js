const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    campaignName: {
        type: String,
        required: true
    },
    campaignId: {
        type: String,
        required: true
    },
    influencerName: {
        type: String,
        required: true
    },
    contractStatus: {
        type: String,
        required: true
    },
    negotiationTerms: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Contract = mongoose.model('contract', ContractSchema);

module.exports = {
    Contract
};