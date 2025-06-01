const { MessageThread } = require('../dbSchema/messagesModel');
const _ = require('lodash');

// Fetch all messages for a user
async function fetchMessagesForUser(userId, sessionId, agentName) {
    const thread = await MessageThread.findOne({ userId, sessionId, agentName }).lean();
    return thread ? thread.messages : [];
}

async function fetchAllSessionsForUser(userId, agentName) {
    const threads = await MessageThread.find({ userId, agentName }).lean();
    return { sessions: threads.map(thread => thread.sessionId) };
}

async function getMessagesBySessionIdForUser(userId, sessionId, agentName) {
    const threads = await MessageThread.find({ userId, sessionId, agentName }).lean();
    return threads.map(thread => {
        const messages = thread.messages.filter(message => {
            if (message.role === 'system' || _.has(message, 'tool_calls') || message.role === 'tool') {
                return false;
            }
            return true;
        });

        return {
            sessionId: thread.sessionId,
            agentName: thread.agentName,
            messages: messages
        };
    });
}

// Upsert (add) new messages for a user
async function upsertMessageForUser(userId, newMessages, sessionId, agentName) {
    await MessageThread.findOneAndUpdate(
        { userId, sessionId, agentName },
        { 
            $push: { messages: { $each: newMessages } },
            $setOnInsert: { _id: sessionId }
        },
        { upsert: true, new: true }
    );
}

module.exports = {
    fetchMessagesForUser,
    upsertMessageForUser,
    fetchAllSessionsForUser,
    getMessagesBySessionIdForUser
};
