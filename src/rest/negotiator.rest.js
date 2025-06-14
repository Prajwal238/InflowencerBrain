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
    const { campaignId } = req.query;
    if (!userId || !campaignId) {
        return res.status(400).json({ error: 'userId and campaignId are required.' });
    }
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();
    const conversations = await negotiatorService.getAllInfluencerConversations(campaignId);
    res.json(conversations);
});

router.get('/campaigns/:campaignId/platform/:platform/getConversation/:InfluencerId', async (req, res) => {
    const { InfluencerId, campaignId, platform } = req.params;
    if (!InfluencerId || !campaignId || !platform) {
        return res.status(400).json({ error: 'InfluencerId, campaignId and platform are required.' });
    }

    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();  
    if(req?.query?.poll) {
        const newMessage = {
            role: "Influencor",
            message: `Sure! Here is my contact number, ${process.env.PHONE_NUMBER}, Lets talk over call?`
        }
        const conversation = await negotiatorService.updateConversation(InfluencerId, campaignId, platform, newMessage);
        res.json(conversation);
    } else {
        const messageThread = await negotiatorService.getConversation(InfluencerId, campaignId, platform);
        res.json(messageThread);
    }
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

router.get('/getCampaignDetails', async (req, res) => {
    const { campaignName } = req.query;
    if (!campaignName) {
        return res.status(400).json({ error: 'campaignName is required.' });
    }
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();
    const campaignDetails = await negotiatorService.getCampaignDetails(campaignName);
    res.json(campaignDetails);
});

router.post('/confirmNegotionTerms', async (req, res) => {
    const { campaignName, influencerName, negotiationTerms, convId, campaignId } = req.body;
    const contract = { campaignName, influencerName, negotiationTerms };
    if (!campaignName || !influencerName || !negotiationTerms || !convId || !campaignId) {
        return res.status(400).json({ error: 'campaignName, influencerName, convId, campaignId and negotiationTerms are required.' });
    }
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();
    const response = await negotiatorService.confirmNegotionTerms(contract, {convId, campaignId});
    res.json(response);
});

router.get('/getConversation/:campaignId/:influencerId', async (req, res) => {
    const { campaignId, influencerId } = req.params;
    const NegotiatorService = require('../services/negotiatorService');
    const negotiatorService = NegotiatorService.getInst();
    const conversation = await negotiatorService.getCallConversations(campaignId, influencerId);
    res.json(conversation);
});

module.exports = router;

