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

InfluencerAgent.prototype.getFiltersFromUserPromptForRetrieval = async function(userPrompt) {
    const messages = [
        {"role": "system", "content": "You are a helpful assistant that extracts filters from a user query for influencer search."},
        {"role": "user", "content": userPrompt}
      ]
    const extraTools = {
        "type": "function",
        "function": {   
            "name": "extract_influencer_filters",
            "description": "Call this function only when asked to extract filters from the user query",
            "parameters": {
                "type": "object",
                "properties": {
                    "locations": {
                        "type": "array",
                        "items": { 
                            "type": "string" 
                        },
                        "description": "List of locations such as countries or cities"
                    },
                    "categories": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "List of influencer categories like fashion, beauty, fitness"
                    },
                    "min_rating": {
                    "type": "number",
                    "description": "Minimum rating if specified"
                    }
                },
                "required": []
            }
        }
    }  
    const tools = this.defaultTools.concat(extraTools);
    const response = await this.baseAgent.sendMessage({ messages, tools });
    if(response.type === 'tool_call') {
        const args = JSON.parse(response.toolCall.function.arguments);
        return args;
    }
    return response;
}

InfluencerAgent.prototype.getInfluencersForCampaignFromLLM = async function(influencers, userPrompt) {
    
    const messages = [
        { 
            role: 'system',
            content: getInfluencerAgentSystemPrompt(JSON.stringify(influencers))
        },
        { 
            role: 'user', 
            content: userPrompt
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