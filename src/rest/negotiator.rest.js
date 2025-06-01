const express = require('express');
const router = express.Router();
const influencerMessagesModel = require('../../models/getInfMessagesModel');

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

router.get('/:userId/getAllInfluencerConversations', async (req, res) => {
    const { userId } = req.params;
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

router.post('/:userId/getAIResponse', async (req, res) => {
    const { userId } = req.params;
    const { messages } = req.body;
    if (!userId || !messages) {
        return res.status(400).json({ error: 'userId and messages are required.' });
    }
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();
    const response = await negotiatorService.getAIResponse(userId, messages);
    res.json(response);
});

module.exports = router;

