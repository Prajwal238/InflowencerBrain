const influencerModel = require('../../models/getInfluencerModel');
const campaignModel = require('../../models/getCampaignsModel');
const InfluencerAgent = require('../agents/influencerAgent');

const influencerAgent = new InfluencerAgent({
    llmApiKey: process.env.OPENAI_API_KEY,
    llmEndpoint: process.env.OPENAI_ENDPOINT,
    agentName: 'influencerAgent'
});

function InfluencerService() {}

InfluencerService.prototype.getInfluencers = async function(userId) {
    const influencers = await influencerModel.getAllInfluencers();
    return influencers;
}

InfluencerService.prototype.addInfluencerToCampaign = async function(userId, campaignId, influencerId) {
    const campaign = await campaignModel.getCampaignById(campaignId);
    if (!campaign) {
        return { error: 'Campaign not found' };
    }
    const influencer = await influencerModel.getInfluencersByIds([influencerId]);
    if (!influencer) {
        return { error: 'Influencer not found' };
    }
    campaign.influencers = campaign.influencers ?? [];
    campaign.influencers.push(influencerId);
    await campaignModel.updateCampaignById(campaignId, campaign);
    return campaign;
}

InfluencerService.prototype.removeInfluencerFromCampaign = async function(userId, campaignId, influencerId) {
    const campaign = await campaignModel.getCampaignById(campaignId);
    if (!campaign) {
        return { error: 'Campaign not found' };
    }
    campaign.influencers = campaign.influencers ?? [];
    campaign.influencers = campaign.influencers.filter(id => id !== influencerId);
    await campaignModel.updateCampaignById(campaignId, campaign);
    return campaign;
}

InfluencerService.prototype.getInfluencersByCampaignId = async function(userId, campaignId) {
    const campaign = await campaignModel.getCampaignById(campaignId);
    if (!campaign) {
        return { error: 'Campaign not found' };
    }
    const influencers = await influencerModel.getInfluencersByIds(campaign.influencers);
    return influencers;
}

InfluencerService.prototype.getInfluencersForCampaignFromLLM = async function(userId, campaignId, userPrompt) {
    const influencers = await influencerAgent.getInfluencersForCampaignFromLLM(campaignId, userPrompt);
    return influencers;
}

module.exports = {
    getInst: function() {
        return new InfluencerService();
    }
};