const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        // not required for OAuth users
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Only present if user logs in via Google
    },
    name: {
        type: String // Full name from Google profile
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleDocsAccessToken: {
        type: String,
        sparse: true // Only present if user logs in via Google
    },
    googleDocsRefreshToken: {
        type: String,
        sparse: true // Only present if user logs in via Google
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;