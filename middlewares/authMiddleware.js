const jwt = require('../config/jwt');

// Hàm xác thực token dịch token ra user -> gán user vào req.user
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Lấy token từ cookie 
    if (!token) { 
        return res.redirect('/auth/login');  // Nếu không có token -> chuyển hướng đến trang login
    }

    try {
        const user = jwt.verifyToken(token); // Giải mã token
        req.user = user; // Gán user vào req.user
        next();
    } catch (error) {
        return res.redirect('/auth/login'); // Nếu token không hợp lệ -> chuyển hướng đến trang login
    }
};

module.exports = authenticateToken;
