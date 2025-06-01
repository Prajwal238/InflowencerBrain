const influencerMessagesModel = require('../../models/getInfMessagesModel');
const NegotiatorAgent = require('../agents/negotiatorAgent');

const negotiatorAgent = new NegotiatorAgent({
    llmApiKey: process.env.OPENAI_API_KEY,
    llmEndpoint: process.env.OPENAI_ENDPOINT,
    agentName: 'negotiatorAgent'
});

function NegotiatorService() {}

NegotiatorService.prototype.getAllInfluencerConversations = async function() {
    const conversations = await influencerMessagesModel.getAllInfluencerConversations();
    return conversations;
}

NegotiatorService.prototype.getConversation = async function(influencerId, campaignId, platform) {
    const messageThread = await influencerMessagesModel.getInfluencerConversation(influencerId, campaignId, platform);
    return messageThread;
}

NegotiatorService.prototype.updateConversation = async function(influencerId, campaignId, platform, newMessage) {
    const conversation = await influencerMessagesModel.updateConversation(influencerId, campaignId, platform, newMessage);
    return conversation;
}

NegotiatorService.prototype.getAIResponse = async function(userId, messages) {
    const response = await negotiatorAgent.getAIResponse(userId, messages);
    return response;
}


module.exports = {
    getInst: () => {
        return new NegotiatorService();
    }
};
