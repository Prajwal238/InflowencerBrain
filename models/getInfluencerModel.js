const { Influencer } = require('../dbSchema/influencerModel');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

/**
 * Reads influencer mock data from JSON and upserts into the database.
 */
async function createInfluencerMockData() {
    const filePath = path.join(__dirname, '../mockData/influencerMockData.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const influencers = JSON.parse(data);

    for (const influencer of influencers) {
        // Upsert to avoid duplicates (based on unique 'name')
        await Influencer.updateOne(
            { name: influencer.name },
            { $set: influencer },
            { upsert: true }
        );
    }
    console.log('Influencer mock data inserted/updated successfully.');
}

async function getAllInfluencers() {
    const influencers = await Influencer.find({});
    return influencers;
}

async function getInfluencersByIds(influencerIds) {
    try {
        var query = { _id: { $in: influencerIds } };
        const influencers = await Influencer.find(query);
        return influencers;
    } catch (error) {
        console.error('Error fetching influencers:', error);
        return [];
    }
}

module.exports = {
    createInfluencerMockData,
    getAllInfluencers,
    getInfluencersByIds
};