const influencerModel = require('../../models/getInfluencerModel');
const campaignModel = require('../../models/getCampaignsModel');
const InfluencerAgent = require('../agents/influencerAgent');
const axios = require('axios');

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
    const campaign = await campaignModel.getCampaignById(campaignId);

    userPrompt = userPrompt || `I need to find the top 5 best influencers for my campaign ${campaign.campaignName}, here is its description: ${campaign.description}, and its objective: ${campaign.objective}`;
    const filters = await influencerAgent.getFiltersFromUserPromptForRetrieval(userPrompt);
    const response = await axios({
        method: 'POST',
        url: `${process.env.RAG_SERVER_URL}/rag/discovery`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          userPrompt: userPrompt,
          filters: filters
        },
    });
    console.log("Influencers from RAG: ", JSON.stringify(response.data, null, 2));
    const influencers = await influencerAgent.getInfluencersForCampaignFromLLM(response.data, userPrompt);
    console.log("Influencers from LLM: ", JSON.stringify(influencers, null, 2));
    return influencers;
}

module.exports = {
    getInst: function() {
        return new InfluencerService();
    }
};