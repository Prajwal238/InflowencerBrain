const mongoose = require('mongoose');

const InfluencerConversationSchema = new mongoose.Schema({
    _id: { 
        type: String,
        required: true
    },

    influencerName: { 
        type: String,
        required: true,
        index: true
    },

    campaignId: {
        type: String,
        required: true,
        index: true
    },

    platform: {
        type: String,
        required: true
    },

    convId: {
        type: String,
    },

    messages: [
        { 
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    ]
}, { timestamps: true });

const InfluencerConversation = mongoose.model('InfluencerConversation', InfluencerConversationSchema);

module.exports = { InfluencerConversation };