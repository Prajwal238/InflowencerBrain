const express = require('express');
const router = express.Router();
const OutreachService = require('../services/outreachService');
const { Readable } = require('stream');

router.get('/campaigns/:campaignId/outreach_seed', async (req, res) => {
    const userId = req.userId;
    const { campaignId } = req.params;
    const outreachService = OutreachService.getInst();
    const result = await outreachService.getOutreachSeed(userId, campaignId);
    res.status(200).json(result);
});

router.post('/voice_preview', async (req, res) => {
    const userId = req.userId;
    const { message, language } = req.body;
    if(!userId || !message || !language) {
        return res.status(400).json({ error: 'userId, message and language are required' });
    }

    const outreachService = OutreachService.getInst();
    try {

        const audioStream = await outreachService.getVoicePreview(userId, message, language);    

        res.setHeader('Content-Type', 'audio/mpeg');
        audioStream.pipe(res);

    } catch (error) {
        console.error('Error in voice preview endpoint:', error.message);
        res.status(500).json({ error: 'Failed to generate speech' });
    }
});

router.post('/outreach/:campaignId/platform/:platform/updateConversation/:InfluencerId', async (req, res) => {
    const { InfluencerId, campaignId, platform } = req.params;
    const newMessage = req.body;

    if (!InfluencerId || !campaignId || !platform) {
        return res.status(400).json({ error: 'InfluencerId, campaignId and platform are required.' });
    }
    const OutreachService = require('../services/outreachService');
    const outreachService = OutreachService.getInst();
    var opts = {firstMessage: true};
    const conversation = await outreachService.updateConversation(InfluencerId, campaignId, platform, newMessage, opts);
    res.json(conversation);
});

router.post('/campaigns/:campaignId/ai_message', async (req, res) => {
    const userId = req.userId;
    const { campaignId } = req.params;

    const outreachService = OutreachService.getInst();
    const result = await outreachService.generateAIMessage(userId, campaignId, req.body);
    res.status(200).json(result);
});

module.exports = router;
