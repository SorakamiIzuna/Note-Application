require('dotenv').config();
const crypto = require('crypto');
const { URL } = require('url');

// Database
const shareNote = require('../models/shareModels.js');

// SECRET_KEY có thể đổi thành khóa mã hóa
const SECRET_KEY = "Cryptography"

// Hàm tạo URL tạm thời
// Cần thêm dữ liệu khóa mã hóa ghi chú
const generateURL = (noteID, expirationSeconds, iv) => {
    const expirationTimestamp = Math.floor(Date.now() / 1000) + expirationSeconds;
    const data = `${noteID}:${expirationTimestamp}`;
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');

    const baseURL = 'http://localhost:3000';
    const url = `${baseURL}/${noteID}?expires=${expirationTimestamp}&iv=${iv}&signature=${signature}`;
    return url;
}

// Kiểm tra thời hạn của URL
const checkValidUrl = (noteId, expires, signature) => {
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > Number(expires)) {
        return false;
    }

    const data = `${noteId}:${expires}`;
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature, "utf-8"), Buffer.from(expectedSignature, "utf-8"));
}

// Xác minh URL
// Cần xác minh thêm khóa mã hóa ?
const verifyURL = (url) => {
    const parsedUrl = new URL(url);
    const noteIdFromUrl = parsedUrl.pathname.split("/").pop();
    const expiresFromUrl = parsedUrl.searchParams.get("expires");
    const signatureFromUrl = parsedUrl.searchParams.get("signature");
    return checkValidUrl(noteIdFromUrl, expiresFromUrl, signatureFromUrl);
}

// Thêm URL tạm thời của note vào database
const addURLToDatabase = async (noteId, iv) => {
    // Kiểm tra note đã tồn tại trong Share chưa? Nếu chưa thì tạo URL rồi thêm vào, nếu có rồi thì kiểm tra xem hết hạn chưa (Chưa: Không thêm, Rồi: Tạo URL mới và cập nhật lại)
    try {
        const note = await shareNote.findById(noteId)
        if (!note) {
            const url = generateURL(noteId, 3600, iv);
            const newUrl = new shareNote({
                _id: noteId,
                url: url
            });
            const response = await newUrl.save();
            console.log("Add URL: ", response);
        }
        else {
            const currentURL = note.url;
            if (!verifyURL(currentURL)) {
                const newURL = generateURL(noteId, 3600, iv);
                note.url = newURL;
                const response = await note.save();
                console.log("Update URL: ", response);
                return response;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { generateURL, verifyURL, addURLToDatabase };