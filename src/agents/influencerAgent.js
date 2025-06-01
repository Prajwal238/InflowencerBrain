const BaseAIAgent = require('./baseAIAgent');
const influencerModel = require('../../models/getInfluencerModel');
const influencerConfig = require('./tools/influencerAgentTools.json');
const campaignModel = require('../../models/getCampaignsModel');
const { getInfluencerAgentSystemPrompt } = require('./agentPrompts');

function InfluencerAgent({ llmApiKey, llmEndpoint, agentName }) {
    this.baseAgent = new BaseAIAgent({
        llmApiKey: llmApiKey,
        llmEndpoint: llmEndpoint
    });
    this.agentName = agentName;
    this.defaultTools = influencerConfig.influencerAgentTools;
}

InfluencerAgent.prototype.getInfluencersForCampaignFromLLM = async function(campaignId, userPrompt) {
    

    const campaign = await campaignModel.getCampaignById(campaignId);
    const campaignDetails = JSON.stringify(campaign);

    const influencers = await influencerModel.getAllInfluencers();
    const influencersDetails = JSON.stringify(influencers);

    const messages = [
        { 
            role: 'system',
            content: getInfluencerAgentSystemPrompt(influencersDetails)
        },
        { 
            role: 'user', 
            content: userPrompt ? userPrompt : `I need to find the top 5 best influencers for my campaign ${campaign.campaignName}.\n ` 
        }
    ];
    const response = await this.baseAgent.sendMessage({ messages, tools: this.defaultTools });
    if(response.type === 'tool_call') {
        const args = JSON.parse(response.toolCall.function.arguments);
        
        const influencers = args.influencers.map(influencer => influencer.influencerId);
        return await influencerModel.getInfluencersByIds(influencers);
    }
    return response;
}


module.exports = InfluencerAgent;