const express = require('express');
const router = express.Router();

router.post('/campaigns/:campaignId/platform/:platform/updateConversation/:InfluencerId', async (req, res) => {
    const { InfluencerId, campaignId, platform } = req.params;
    const newMessage = req.body;

    if (!InfluencerId || !campaignId || !platform) {
        return res.status(400).json({ error: 'InfluencerId, campaignId and platform are required.' });
    }
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();
    const conversation = await negotiatorService.updateConversation(InfluencerId, campaignId, platform, newMessage);
    res.json(conversation);
});

router.get('/getAllInfluencerConversations', async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required.' });
    }
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();
    const conversations = await negotiatorService.getAllInfluencerConversations(userId);
    res.json(conversations);
});

router.get('/campaigns/:campaignId/platform/:platform/getConversation/:InfluencerId', async (req, res) => {
    const { InfluencerId, campaignId, platform } = req.params;
    if (!InfluencerId || !campaignId || !platform) {
        return res.status(400).json({ error: 'InfluencerId, campaignId and platform are required.' });
    }
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();  
    const messageThread = await negotiatorService.getConversation(InfluencerId, campaignId, platform);
    res.json(messageThread);
});

router.post('/getAIResponse', async (req, res) => {
    const userId = req.userId;
    const { messages } = req.body;
    if (!userId || !messages) {
        return res.status(400).json({ error: 'userId and messages are required.' });
    }
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();
    const response = await negotiatorService.getAIResponse(userId, messages);
    res.json(response);
});

router.post('/campaigns/:campaignId/makeOutBoundCall', async (req, res) => {
    const userId = req.userId;
    const { campaignId } = req.params;
    const { phoneNumber, influencerName } = req.body;

    let formattedPhoneNumber = phoneNumber;
    if (!formattedPhoneNumber.startsWith('+91')) {
        formattedPhoneNumber = '+91' + formattedPhoneNumber;
    }

    if (!userId || !formattedPhoneNumber || !campaignId || !influencerName) {
        return res.status(400).json({ error: 'userId, phoneNumber, campaignId and influencerName are required.' });
    }
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();
    const response = await negotiatorService.makeOutBoundCall(userId, formattedPhoneNumber, campaignId, influencerName);
    res.json(response);
});

module.exports = router;

