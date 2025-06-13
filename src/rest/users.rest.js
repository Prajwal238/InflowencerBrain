const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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

router.get('/auth/google', passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/documents'
    ],
    accessType: 'offline',
    prompt: 'consent' // forces refreshToken every time (good for testing)
}));
  
  
router.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login',
      session: false
    }),
    (req, res) => {
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`${process.env.HOST_URL}/api/auth/?token=${token}`);
    }
);


module.exports = router;
