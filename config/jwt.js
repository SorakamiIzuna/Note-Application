const jwt = require('jsonwebtoken');

exports.generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}