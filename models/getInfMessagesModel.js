const { InfluencerConversation } = require('../dbSchema/influencerConverationModel');


async function getAllInfluencerConversations() {
    const conversations = await InfluencerConversation.find();
    return conversations;
}

async function getInfluencerConversation(influencerName, campaignId, platform) {
    var query = { influencerName, campaignId, platform };
    const conversation = await InfluencerConversation.findOne(query);
    return conversation?.messages || [];
}

async function updateConversation(influencerName, campaignId, platform, newMessage) {
    const conversation = await InfluencerConversation.findOneAndUpdate(
        { _id: influencerName, influencerName, campaignId, platform },
        { 
            $push: { messages: newMessage }
        },
        { upsert: true, new: true }
    );
    return conversation?.messages || [];
}

module.exports = { 
    getInfluencerConversation,
    updateConversation,
    getAllInfluencerConversations
};