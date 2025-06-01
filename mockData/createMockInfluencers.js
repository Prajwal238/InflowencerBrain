const mongoose = require('mongoose');
const { createInfluencerMockData } = require('../models/getInfluencerModel');

async function main() {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/influencer_app', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await createInfluencerMockData();
    console.log('Done!');
    await mongoose.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});