const campaignModel = require('../../models/getCampaignsModel');
const influencerModel = require('../../models/getInfluencerModel');
const axios = require('axios');
const OutReachAgent = require('../agents/outReachAgent');

const outreachAgent = new OutReachAgent({
    llmApiKey: process.env.OPENAI_API_KEY,
    llmEndpoint: process.env.OPENAI_ENDPOINT,
    agentName: 'outreachAgent'
});

function OutreachService() {}

OutreachService.prototype.getOutreachSeed = async (userId, campaignId) => {
    const result = {}
    const campaign = await campaignModel.getCampaignById(campaignId);
    if (!campaign) {
        return { error: 'Campaign not found' };
    }
    const influencers = await influencerModel.getInfluencersByIds(campaign.influencers);
    result.influencers = influencers;
    return result;
}

OutreachService.prototype.generateAIMessage = async (userId, campaignId, body) => {
    const {language, messageTemplate} = body;
    const campaign = await campaignModel.getCampaignById(campaignId);
    if (!campaign) {
        return { error: 'Campaign not found' };
    }
    const response = await outreachAgent.generateAIMessage(userId, campaign, language, messageTemplate);
    return response;
}

OutreachService.prototype.getVoicePreview = async (userId, message, language) => {

    const languageVoiceMap = {
        en: 'EXAVITQu4vr4xnSDxMaL', // English
        es: 'TxGEqnHWrfWFTfGW9XjX', // Spanish
        fr: 'ErXwobaYiN019PkySvjV', // French
        de: 'MF3mGyEYCl7XYWbV9V6O', // German
    };
    const voiceId = languageVoiceMap[language] || languageVoiceMap['en'];

    try {
        const response = await axios({
            method: 'POST',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            headers: {
              'xi-api-key': process.env.ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
              'Accept': 'audio/mpeg'
            },
            data: {
              text: message,
              voice_settings: {
                stability: 0.75,
                similarity_boost: 0.75
              }
            },
            responseType: 'stream'
          });
        
        return response.data;
    } catch (error) {
        console.error('Error generating speech:', error.message);
        res.status(500).json({ error: 'Failed to generate speech' });
    }
}

module.exports = {
    getInst: () => {
        return new OutreachService();
    }
};