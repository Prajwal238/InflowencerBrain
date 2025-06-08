const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');

router.post('/signup', async(req, res) => {
    try{
        const { email, username, password } = req.body;
        const userService = UserService.getInst();
        const user = await userService.signup(email, username, password);
        res.status(200).json(user);
    } catch(err){
        res.status(500).json({ error: 'Failed to signup', details: err.message });
    }
});

router.post('/login', async(req, res) => {
    try{
        const { email, password } = req.body;
        const userService = UserService.getInst();
        const response = await userService.login(email, password);
        if(response.error){
            return res.status(401).json({ error: response.error });
        }
        res.status(200).json(response);
        
    } catch(err){
        res.status(500).json({ error: 'Failed to login', details: err.message });
    }
});

module.exports = router;
