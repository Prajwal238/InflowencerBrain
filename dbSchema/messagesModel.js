const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    _id: { 
        type: String,
        required: true
    },

    userId: { 
        type: String,
        required: true,
        index: true
    },

    sessionId: {
        type: String,
        required: true,
        index: true
    },

    agentName: {
        type: String,
        required: true
    },

    messages: [
        { 
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    ]
}, { timestamps: true });

const MessageThread = mongoose.model('MessageThread', MessageSchema);

module.exports = { MessageThread };