const influencerMessagesModel = require('../../models/getInfMessagesModel');
const NegotiatorAgent = require('../agents/negotiatorAgent');
const campaignModel = require('../../models/getCampaignsModel');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const contractModel = require('../../models/getContractsModel');

const negotiatorAgent = new NegotiatorAgent({
    llmApiKey: process.env.OPENAI_API_KEY,
    llmEndpoint: process.env.OPENAI_ENDPOINT,
    agentName: 'negotiatorAgent'
});

function NegotiatorService() {}

NegotiatorService.prototype.getAllInfluencerConversations = async function(campaignId) {
    const conversations = await influencerMessagesModel.getAllInfluencerConversations(campaignId);
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

NegotiatorService.prototype.makeOutBoundCall = async function(userId, phoneNumber, campaignId, influencerName) {
    const campaign = await campaignModel.getCampaignById(campaignId);

    try{
        const response = await axios.post('https://api.elevenlabs.io/v1/convai/twilio/outbound-call', {
            agent_id: process.env.ELEVEN_LABS_AGENT_ID,
            agent_phone_number_id: process.env.ELEVEN_LABS_AGENT_PHONE_ID,
            to_number: phoneNumber,
            conversation_initiation_client_data: {
                dynamic_variables: {
                    "Influencer_name": influencerName,
                    "company_name": campaign.companyName,
                    "campaign_name": campaign.campaignName
                }
            }
        }, {
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            }
        });
    
        return response.data;    

    } catch(err){
        return {
            status: 'error',
            message: 'Failed to make outbound call JSON: ' + JSON.stringify(err.response.data)
        };
    }
}

NegotiatorService.prototype.getCampaignDetails = async function(campaignName) {
    const campaign = await campaignModel.getCampaignByName(campaignName);
    return campaign;
}

NegotiatorService.prototype.confirmNegotionTerms = async function(contract) {
    const _id = "contract-" + uuidv4();

    if(contract.campaignName){
        contract.campaignName = contract.campaignName.toLowerCase();
        const campaign = await campaignModel.getCampaignByName(contract.campaignName);
        contract.campaignId = campaign?._id;
    }
    if(contract.negotiationTerms.length > 0){
        contract.contractStatus = "tobesigned";
    }
    const response = await contractModel.createContract({ _id, ...contract });
    if(response){
        return {
            status: 'success',
            message: 'Contract created successfully'
        };
    } else {
        return {
            status: 'error',
            message: 'Failed to create contract'
        };
    }
}

module.exports = {
    getInst: () => {
        return new NegotiatorService();
    }
};
