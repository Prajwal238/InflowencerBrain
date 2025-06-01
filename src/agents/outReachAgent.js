const BaseAIAgent = require('./baseAIAgent');
const outreachConfig = require('./tools/outreachAgentTools.json');
const campaignModel = require('../../models/getCampaignsModel');
const { getOutReachAgentSystemPrompt, getOutReachAgentDefaultUserPrompt } = require('./agentPrompts');

function OutReachAgent({ llmApiKey, llmEndpoint, agentName }) {
    this.baseAgent = new BaseAIAgent({
        llmApiKey: llmApiKey,
        llmEndpoint: llmEndpoint
    });
    this.agentName = agentName;
    this.defaultTools = outreachConfig.outreachAgentTools;
}

OutReachAgent.prototype.generateAIMessage = async function(userId, campaign, language, messageTemplate) {

    const messages = [
        {
            "role": "system",
            "content": getOutReachAgentSystemPrompt(language, messageTemplate)
        },
        {
            "role": "user",
            "content": getOutReachAgentDefaultUserPrompt(campaign)
        }
    ]
    const response = await this.baseAgent.sendMessage({ messages, tools: this.defaultTools });
    return response;
}

module.exports = OutReachAgent;