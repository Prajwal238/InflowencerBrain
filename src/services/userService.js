const userModel = require('../../models/getUsersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function UserService() {}

UserService.prototype.signup = async function(email, username, password) {
    const response = {
        success: false,
        message: 'Failed to signup',
        data: null
    }
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.createUser(email, username, hashedPassword);
        response.success = true;
        response.message = 'User created successfully';
        return response;
    } catch(err){
        response.message = err.message;
        return response;
    }
}

UserService.prototype.login = async function(email, password) {
    const user = await userModel.getUserByEmail(email);
    if (!user) {
        return { error: 'Authentication failed' };
    }
    if(user.authProvider === 'google'){
        return { error: 'Please use Google Sign-In for this account.' };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { error: 'Authentication failed' };
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
}

module.exports = {
    getInst: function() {
        return new UserService();
    }
};
