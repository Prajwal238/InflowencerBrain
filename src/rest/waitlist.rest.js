const express = require('express');
const router = express.Router();
const WaitlistService = require('../services/waitlistService.js');

router.post('/waitlist', async (req, res) => {
    const data = req.body;
    const waitlistService = WaitlistService.getInst();
    const result = await waitlistService.addEmailToWaitlist(data);
    res.status(200).json(result);
});

module.exports = router;
