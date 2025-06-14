const express = require('express');
const router = express.Router();
const CampaignService = require('../services/campaignService');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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

router.post('/campaigns/voiceMessage', upload.single('audio'), async (req, res) => {
    try {
        const userId = req.userId;
        const sessionId = req.query.sessionId;
        if(!userId || !sessionId) {
            return res.status(400).json({ error: 'userId and sessionId are required.' });
        }
        const campaignService = CampaignService.getInst();
        const result = await campaignService.processVoiceMessage(userId, sessionId, req.file.buffer);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to process voice message', details: err.message });
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

router.get('/google/docs', async (req, res) => {
    try{
        const user = req.userId;
        const campaignService = CampaignService.getInst();
        const result = await campaignService.getGoogleDocsForUser(user);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: 'Failed to get Google docs', details: err.message });
    }
  });
  

module.exports = router;