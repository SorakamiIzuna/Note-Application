const jwt = require('jsonwebtoken');

// Hàm tạo token
exports.generateToken = (user) => {
    // Tạo token với id và username của user
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
};

// Hàm xác thực token
exports.verifyToken = (token) => {
    try {
        // Giải mã token
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};




