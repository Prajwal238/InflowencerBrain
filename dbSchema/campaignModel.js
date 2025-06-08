const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    campaignName: {
        type: String,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    },
    objective: {
        type: String,
        enum: ['brand_awareness', 'engagement', 'conversions'],
        required: true
    },
    totalBudget: {
        type: Number
    },
    targetAudience: {
        location: String,
        ageRange: String,
        gender: String,
        interests: [String]
    },
    preferredPlatforms: {
        type: [String] // e.g., ['instagram', 'youtube']
    },
    languages: {
        type: [String] // e.g., ['english', 'hindi']
    },
    influencers: {
        type: [String] //Ids of influencers
    }
});

const Campaign = mongoose.model('Campaign', CampaignSchema);

module.exports = {
  Campaign
};
