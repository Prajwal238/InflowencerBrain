const jwt = require('jsonwebtoken');

function AuthMiddleware() {
    function verifyToken(req, res, next) {
        if((req.path === '/api/signup' || req.path === '/api/login') && req.method === 'POST'){
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