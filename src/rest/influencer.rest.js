const express = require('express');
const router = express.Router();
const InfluencerService = require('../services/influencerService');

router.get('/:userId/influencers', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required.' });
        }
        const influencerService = InfluencerService.getInst();
        const result = await influencerService.getInfluencers(userId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get influencers', details: err.message });
    }
});

router.post('/:userId/campaigns/:campaignId/influencers', async (req, res) => {
    try {
        const { userId, campaignId } = req.params;
        const { influencerId, removeInfluencerId } = req.body;
        if (!userId || !campaignId || (!influencerId && !removeInfluencerId)) {
            return res.status(400).json({ error: 'userId, campaignId and influencerId are required.' });
        }

        if(removeInfluencerId) {
            const influencerService = InfluencerService.getInst();
            const result = await influencerService.removeInfluencerFromCampaign(userId, campaignId, removeInfluencerId);
            res.status(201).json(result);
        } else {
            const influencerService = InfluencerService.getInst();
            const result = await influencerService.addInfluencerToCampaign(userId, campaignId, influencerId);
            res.status(201).json(result);
        }
        
    } catch (err) {
        res.status(500).json({ error: 'Failed to create influencer', details: err.message });
    }
});

router.get('/:userId/campaigns/:campaignId/influencers', async (req, res) => {
    try {
        const { userId, campaignId } = req.params;
        if (!userId || !campaignId) {
            return res.status(400).json({ error: 'userId and campaignId are required.' });
        }
        const influencerService = InfluencerService.getInst();
        const result = await influencerService.getInfluencersByCampaignId(userId, campaignId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get influencers', details: err.message });
    }
});

router.get('/:userId/campaigns/:campaignId/influencers/llm', async (req, res) => {
    try {
        const { userId, campaignId } = req.params;
        if (!userId || !campaignId) {
            return res.status(400).json({ error: 'userId and campaignId are required.' });
        }
        const influencerService = InfluencerService.getInst();
        const result = await influencerService.getInfluencersForCampaignFromLLM(userId, campaignId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get influencers', details: err.message });
    }
});

router.post('/:userId/campaigns/:campaignId/influencers/llm', async (req, res) => {
    try {
        const { userId, campaignId } = req.params;
        const { userPrompt } = req.body;
        if (!userId || !campaignId) {
            return res.status(400).json({ error: 'userId and campaignId are required.' });
        }
        const influencerService = InfluencerService.getInst();
        const result = await influencerService.getInfluencersForCampaignFromLLM(userId, campaignId, userPrompt);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get influencers', details: err.message });
    }
});

module.exports = router;