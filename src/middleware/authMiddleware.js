const jwt = require('jsonwebtoken');

function AuthMiddleware() {
    function verifyToken(req, res, next) {
        const excemptedPaths = ['/api/signup', '/api/login', '/api/waitlist', '/api/getCampaignDetails', '/api/confirmNegotionTerms', '/api/auth/google', '/api/auth/google/callback'];
        if(excemptedPaths.includes(req.path) || req.path.includes('api/auth/')){
            return next();
        }

        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
    }

    return verifyToken;
}


module.exports = AuthMiddleware;