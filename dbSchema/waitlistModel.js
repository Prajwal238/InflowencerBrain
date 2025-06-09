const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    businessEmail: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: false
    }
});

const Waitlist = mongoose.model('waitlist', waitlistSchema);

module.exports = Waitlist;
