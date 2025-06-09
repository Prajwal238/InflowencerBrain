const express = require('express');
const router = express.Router();
const ContractService = require('../services/contractService');

router.get('/:campaignId/contracts', async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required.' });
    }
    const campaignId = req.params.campaignId;
    const contractService = ContractService.getInst();
    const contracts = await contractService.getContracts(campaignId);
    res.status(200).json(contracts);
}); 

module.exports = router;