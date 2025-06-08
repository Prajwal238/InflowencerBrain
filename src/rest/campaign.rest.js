const express = require('express');
const router = express.Router();
const CampaignService = require('../services/campaignService');

// POST /campaigns
router.post('/campaigns', async (req, res) => {
    try {
        const userId = req.userId;
        const { prompt, sessionId } = req.body;
        if (!userId || !prompt || !sessionId) {
            return res.status(400).json({ error: 'userId, prompt and sessionId are required.' });
        }
        const campaignService = CampaignService.getInst();
        const result = await campaignService.createCampaignWithAgent(userId, prompt, sessionId);
        res.status(201).json({ message: result.message });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create campaign', details: err.message });
    }
});

router.get('/campaigns', async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required.' });
    }
    const campaignService = CampaignService.getInst();
    const result = await campaignService.getCampaignsForUser(userId);
    res.status(200).json(result);
});

router.get('/campaigns/sessions', async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required.' });
    }
    const campaignService = CampaignService.getInst();
    const result = await campaignService.getSessionsForUser(userId);
    res.status(200).json(result);
});

router.get('/campaigns/sessions/:sessionId', async (req, res) => {
    const userId = req.userId;
    const sessionId = req.params.sessionId;
    if (!sessionId || !userId) {
        return res.status(400).json({ error: 'sessionId and userId are required.' });
    }
    const campaignService = CampaignService.getInst();
    const result = await campaignService.getMessagesForSession(userId, sessionId);
    res.status(200).json(result);
});

module.exports = router;