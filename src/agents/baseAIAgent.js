const axios = require('axios');

class BaseAIAgent {
    constructor({ llmApiKey, llmEndpoint }) {
        this.llmApiKey = llmApiKey;
        this.llmEndpoint = llmEndpoint;
    }

    /**
     * Sends a message history to the LLM and returns the parsed response.
     * @param {Object} payload - { messages, tool }
     * @returns {Object} - { type: 'message'|'tool_call'|'error', message, toolCall }
     */
    async sendMessage(payload) {
        try {
            const response = await axios.post(
                this.llmEndpoint,
                {
                    model: 'gpt-4o', // or your preferred model
                    messages: payload.messages,
                    tools: payload.tools || []
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.llmApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Parse LLM response
            const llmMessage = response.data.choices[0].message;
            if (llmMessage.tool_calls && llmMessage.tool_calls.length > 0) {
                // Tool call detected
                return {
                    type: 'tool_call',
                    toolCall: llmMessage.tool_calls[0], // { name, arguments }
                    message: llmMessage.content || ''
                };
            } else {
                // Just a message
                return {
                    type: 'message',
                    message: llmMessage.content
                };
            }
        } catch (err) {
            return {
                type: 'error',
                message: 'Failed to contact LLM: ' + err?.response?.data?.error?.message
            };
        }
    }
}

module.exports = BaseAIAgent;