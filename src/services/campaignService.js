const CampaignAgent = require('../agents/campaignAgent');
const messageModel = require('../../models/getMessagesModel');
const campaignModel = require('../../models/getCampaignsModel');
const crypto = require('crypto');

const campaignAgent = new CampaignAgent({
    llmApiKey: process.env.OPENAI_API_KEY,
    llmEndpoint: process.env.OPENAI_ENDPOINT,
    agentName: 'campaignAgent'
});

function CampaignService() {}

CampaignService.prototype.insertCampaign = async function(userId, campaign) {
    const base64Id = 'cmp_' + crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);

    var campaign = {
        ...campaign,
        userId: userId,
        _id: base64Id
    }
    campaign = await campaignModel.insertCampaign(campaign);
    return campaign;
};

CampaignService.prototype.editCampaign = async function(userId, updateCampaign) {
    const updatedCampaign = await campaignModel.updateCampaign(userId, updateCampaign);
    return updatedCampaign;
}

CampaignService.prototype.getCampaignById = async function(id) {
    const campaign = await campaignModel.getCampaignById(id);
    return campaign;
};

CampaignService.prototype.getCampaignsForUser = async function(userId) {
    const campaigns = await campaignModel.getAllCampaigns(userId);
    return campaigns;
};

CampaignService.prototype.createCampaignWithAgent = async function(userId, prompt, sessionId) {
    // Fetch all previous messages for this user
    const userMessages = await messageModel.fetchMessagesForUser(userId, sessionId, campaignAgent.agentName);

    // Add the latest user prompt
    const newUserMessage = { role: 'user', content: prompt };
    const messages = [...userMessages, newUserMessage];

    // Pass messages (without system prompt) to agent
    const llmResponse = await campaignAgent.handleUserMessage(messages, userId);

    // Save the new user message and LLM response(s) to the DB
    const messagesToSave = [newUserMessage];

    if (llmResponse.llmMessagesToStore) {
        messagesToSave.push(...llmResponse.llmMessagesToStore);
    } else if (llmResponse.message) {
        messagesToSave.push({ role: 'assistant', content: llmResponse.message });
    }

    await messageModel.upsertMessageForUser(userId, messagesToSave, sessionId, campaignAgent.agentName);

    return llmResponse;
};

CampaignService.prototype.getSessionsForUser = async function(userId) {
    const messageThreads = await messageModel.fetchAllSessionsForUser(userId, campaignAgent.agentName);
    return messageThreads;
};

CampaignService.prototype.getMessagesForSession = async function(userId, sessionId) {
    const messages = await messageModel.getMessagesBySessionIdForUser(userId, sessionId, campaignAgent.agentName);
    return messages;
};

module.exports = {
    "getInst": function () {
        return (new CampaignService());
    }
};