const { InfluencerConversation } = require('../dbSchema/influencerConverationModel');
const { v4: uuidv4 } = require('uuid');

async function getAllInfluencerConversations(campaignId) {
    const conversations = await InfluencerConversation.find({ campaignId });
    return conversations;
}

async function getInfluencerConversation(influencerName, campaignId, platform) {
    var query = { influencerName, campaignId, platform };
    const conversation = await InfluencerConversation.findOne(query);
    return conversation?.messages || [];
}

async function updateConversation(influencerName, campaignId, platform, newMessage, opts={}) {
    
    var conversation;
    var influencerId = opts.influencerId || 'inf-' + uuidv4();

    if(opts.firstMessage) {
        influencerId = 'inf-' + uuidv4();
        conversation = await InfluencerConversation.create({
            _id: influencerId,
            influencerName,
            campaignId,
            platform,
            messages: [newMessage]
        });
        return ;
    }

    conversation = await InfluencerConversation.findOneAndUpdate(
        { influencerName, campaignId, platform },
        { 
            $push: { messages: newMessage }
        },
        { upsert: true, new: true }
    );
    return conversation?.messages || [];
}

async function updateConversationByCampaignIdandInfluencerName(campaignId, influencerName, convId) {
    const conversation = await InfluencerConversation.findOneAndUpdate(
        { campaignId, influencerName },
        { $set: { convId: convId } },
    );
    return conversation;
}

async function getCOnversationById(influencerMsgsId) {
    const conversation = await InfluencerConversation.findOne({ _id: influencerMsgsId });
    return conversation;
}

module.exports = { 
    getInfluencerConversation,
    updateConversation,
    getAllInfluencerConversations,
    updateConversationByCampaignIdandInfluencerName,
    getCOnversationById
};