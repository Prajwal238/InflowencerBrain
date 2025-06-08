const User = require('../dbSchema/usersModel');
const { v4: uuidv4 } = require('uuid');

async function createUser(email, username, hashedPassword) {
    const userId = 'u-' + uuidv4();
    const user = await User.create({ _id: userId, email, username, password: hashedPassword });
    return user;
}   

async function getUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
}

module.exports = {
    createUser,
    getUserByEmail
}