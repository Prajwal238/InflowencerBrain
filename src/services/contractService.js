const contractModel = require('../../models/getContractsModel');

function ContractService() {}

ContractService.prototype.getContracts = async function(campaignId) {
    const contracts = await contractModel.getContracts(campaignId);
    return contracts;
}

module.exports = {
    getInst: () => {
        return new ContractService();
    }
}