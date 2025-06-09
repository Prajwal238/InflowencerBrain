const { Contract } = require('../dbSchema/contractModel');

async function getContracts(campaignId) {
    return await Contract.find({ campaignId });
}

async function getContract(campaignId, influencerName) {
    return await Contract.findOne({ campaignId, influencerName });
}

async function createContract(data) {
    return await Contract.create(data);
}

module.exports = { 
    getContracts,
    getContract,
    createContract 
};