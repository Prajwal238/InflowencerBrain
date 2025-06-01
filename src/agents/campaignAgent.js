const BaseAIAgent = require('./baseAIAgent');
const campaignConfig = require('./tools/campaignAgentTools');
const { CAMPAIGN_AGENT_SYSTEM_PROMPT } = require('./agentPrompts');

class CampaignAgent {
    constructor({ llmApiKey, llmEndpoint, agentName }) {
        this.baseAgent = new BaseAIAgent({ llmApiKey, llmEndpoint });
        this.agentName = agentName;
        this.defaultTools = campaignConfig.campaignAgentTools;
    }

    /**
     * Handles a user message, manages tool-calling, and returns the final response.
     * @param {Array} messages - Array of {role, content} (excluding system prompt)
     * @returns {Object} { message, campaign?, llmMessagesToStore }
     */
    async handleUserMessage(messages, userId) {
        try {
            const CampaignService = require('../services/campaignService');
            // Prepend the system prompt from constants
            const fullMessages = [
                { role: 'system', content: CAMPAIGN_AGENT_SYSTEM_PROMPT },
                ...messages
            ];
            const cleanedMessages = cleanMessagesForOpenAI(fullMessages);
            // 1. Send message history to LLM with default tools
            let llmResponse = await this.baseAgent.sendMessage({
                messages: cleanedMessages,
                tools: this.defaultTools
            });

            // Prepare messages to store in DB
            let llmMessagesToStore = [];

            // 2. If LLM just replies with a message, return it
            if (llmResponse.type === 'message') {
                llmMessagesToStore.push({ role: 'assistant', content: llmResponse.message });
                return { message: llmResponse.message, llmMessagesToStore };
            }

            // 3. If LLM requests a tool call, execute the tool
            if (llmResponse.type === 'tool_call') {
                const toolCall = llmResponse.toolCall;
                const toolArgs = toolCall.function.arguments;
                let params;
                try {
                    params = typeof toolArgs === 'string' ? JSON.parse(toolArgs) : toolArgs;
                } catch (e) {
                    llmMessagesToStore.push({ role: 'assistant', content: 'Invalid tool arguments from LLM.' });
                    return { message: 'Invalid tool arguments from LLM.', llmMessagesToStore };
                }

                // Store the assistant tool call message (OpenAI format)
                const toolCallMessage = {
                    role: 'assistant',
                    tool_calls: [
                        {
                            id: toolCall.id,
                            type: toolCall.type,
                            function: {
                                name: toolCall.function.name,
                                arguments: toolCall.function.arguments
                            }
                        }
                    ]
                };
                llmMessagesToStore.push(toolCallMessage);

                // Execute the tool (create or edit campaign)
                const campaignService = CampaignService.getInst();
                let campaign;
                if (toolCall.function.name === 'createCampaign') {
                    campaign = await campaignService.insertCampaign(userId, params);
                } else if (toolCall.function.name === 'editCampaign') {
                    campaign = await campaignService.editCampaign(userId, params);
                } else {
                    llmMessagesToStore.push({ role: 'assistant', content: 'Unknown tool function.' });
                    return { message: 'Unknown tool function.', llmMessagesToStore };
                }

                // Store the tool response message
                const toolResponseMessage = {
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    name: toolCall.function.name,
                    content: JSON.stringify(campaign)
                };
                llmMessagesToStore.push(toolResponseMessage);

                // 4. Send the tool result back to the agent for a final message
                const finalResponse = await this.baseAgent.sendMessage({
                    messages: [
                        ...cleanedMessages,
                        toolCallMessage,
                        toolResponseMessage
                    ],
                    tool: null
                });

                llmMessagesToStore.push({
                    role: 'assistant',
                    content: finalResponse.message
                });

                return {
                    message: finalResponse.message,
                    campaign,
                    llmMessagesToStore
                };
            }
        } catch (error) {
            console.error('Error in handleUserMessage:', error);
            llmMessagesToStore.push({ role: 'assistant', content: 'Unexpected LLM response.' });
            return { message: 'Unexpected LLM response.', llmMessagesToStore };
        }
    }
}

function cleanMessagesForOpenAI(messages) {
    messages.slice(-10)
    return messages.map(msg => {
        // Only include allowed fields
        const allowed = { role: msg.role, content: msg.content };
        if (msg.name) allowed.name = msg.name;
        if (msg.tool_call_id) allowed.tool_call_id = msg.tool_call_id;
        if (msg.function_call) allowed.function_call = msg.function_call;
        if (msg.tool_calls) allowed.tool_calls = msg.tool_calls;
        return allowed;
    });
}

module.exports = CampaignAgent;