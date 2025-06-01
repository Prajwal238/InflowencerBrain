const express = require('express');
const router = express.Router();
const OutreachService = require('../services/outreachService');
const { Readable } = require('stream');

router.get('/:userId/campaigns/:campaignId/outreach_seed', async (req, res) => {
    const { userId, campaignId } = req.params;
    const outreachService = OutreachService.getInst();
    const result = await outreachService.getOutreachSeed(userId, campaignId);
    res.status(200).json(result);
});

router.post('/:userId/voice_preview', async (req, res) => {
    const { userId } = req.params;
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

router.post('/:userId/campaigns/:campaignId/ai_message', async (req, res) => {
    const { userId, campaignId } = req.params;

    const outreachService = OutreachService.getInst();
    const result = await outreachService.generateAIMessage(userId, campaignId, req.body);
    res.status(200).json(result);
});

module.exports = router;
