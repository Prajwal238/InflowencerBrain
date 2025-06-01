const { Campaign } = require('../dbSchema/campaignModel');

// Insert a new campaign into the database
async function insertCampaign(campaign) {
    const newCampaign = new Campaign(campaign);
    await newCampaign.save();
    return newCampaign.toObject();
}

async function updateCampaign(userId, campaign) {
    var query = { userId: userId, campaignName: campaign.previousCampaignName };
    var update = {};
    if (campaign.campaignToEdit) {
        update = { $set: campaign.campaignToEdit };
    }
    return await Campaign.findOneAndUpdate(query, update);
}

async function updateCampaignById(id, campaign) {
    return await Campaign.findByIdAndUpdate(id, campaign);
}

// Get all campaigns from the database
async function getAllCampaigns(userId) {
    return await Campaign.find({ userId });
}

// Get a campaign by its _id from the database
async function getCampaignById(id) {
    return await Campaign.findById(id).lean();
}

module.exports = {
    insertCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    updateCampaignById
};
