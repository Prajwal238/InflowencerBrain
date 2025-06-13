const CampaignAgent = require('../agents/campaignAgent');
const messageModel = require('../../models/getMessagesModel');
const campaignModel = require('../../models/getCampaignsModel');
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const ffmpeg = require('fluent-ffmpeg');

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

function extractDocId(link) {
    const match = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

async function extractTextFromLink(link) {
    const docId = extractDocId(link);
    if (!docId) {
        return res.status(400).json({ error: 'Invalid document link' });
    }
    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    const response = await axios.get(exportUrl);
    const text = response.data;
    return text;
}

CampaignService.prototype.createCampaignWithAgent = async function(userId, prompt, sessionId, link) {
    // Fetch all previous messages for this user
    const userMessages = await messageModel.fetchMessagesForUser(userId, sessionId, campaignAgent.agentName);

    if(prompt.startsWith('https://docs.google.com/document/d/')) {
        const text = await extractTextFromLink(prompt);
        prompt = text;
    }

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

CampaignService.prototype.processVoiceMessage = async function(userId, sessionId, audioBuffer) {
    const INPUT_PATH = path.join(__dirname, "..", 'uploads', 'temp.webm');
    const OUTPUT_PATH = path.join(__dirname, "..", 'uploads', 'temp.wav');

    fs.writeFileSync(INPUT_PATH, audioBuffer);

    await new Promise((resolve, reject) => {
      ffmpeg(INPUT_PATH)
        .toFormat('wav')
        .on('error', reject)
        .on('end', resolve)
        .save(OUTPUT_PATH);
    });

    const formData = new FormData();
    formData.append('file', fs.createReadStream(OUTPUT_PATH));
    formData.append('model', 'saaras:v2');
    formData.append('language_code', 'en-IN');

    const response = await axios.post('https://api.sarvam.ai/speech-to-text-translate', formData, {
        headers: {
            'api-subscription-key': process.env.SAARIKA_API_KEY,
            ...formData.getHeaders()
        }
    });

    const transcript = response.data.transcript;
    
    if(!transcript || transcript.length === 0) {
        throw new Error('No transcript found');
    }

    return await this.createCampaignWithAgent(userId, transcript, sessionId);

}

module.exports = {
    "getInst": function () {
        return (new CampaignService());
    }
};