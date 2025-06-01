const BaseAIAgent = require('./baseAIAgent');
function NegotiatorAgent({ llmApiKey, llmEndpoint, agentName }) {
    this.baseAgent = new BaseAIAgent({
        llmApiKey: llmApiKey,
        llmEndpoint: llmEndpoint
    });
    this.agentName = agentName;
}

function formatMessages(messages) {
    return messages.map(message => {
        if(message.role === "negotiator") {
            return {
                role: "assistant",
                content: message.message
            };
        } else if(message.role === "Influencor") {
            return {
                role: "user",
                content: message.message
            };
        }
        return message;
    });
}

NegotiatorAgent.prototype.getAIResponse = async function(userId, messages) {
    const formattedMessages = formatMessages(messages);
    const response = await this.baseAgent.sendMessage({ messages: formattedMessages });
    return response;
}

module.exports = NegotiatorAgent;