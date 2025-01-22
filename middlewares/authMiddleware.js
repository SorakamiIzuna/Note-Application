const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Token từ cookie
    if (!token) return res.redirect('/login'); // Chưa đăng nhập

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/login'); // Token không hợp lệ
        req.user = user; // Lưu thông tin người dùng
        next();
    });
};

module.exports = authenticateToken;
