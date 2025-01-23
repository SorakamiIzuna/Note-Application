const crypto = require('crypto');

// Tạo khóa phiên dùng Diffie-Hellman (1024t)
function generateSessionKeys() {
    const dhA = crypto.createDiffieHellman(1024); //1024 bit( hiệu suất nhanh thì kém bảo mật và ngược lại )
    const dhB = crypto.createDiffieHellman(dhA.getPrime(), dhA.getGenerator());

    const keyA = dhA.generateKeys();
    const keyB = dhB.generateKeys();

    // Tạo khóa chung (shared secret)
    const sharedSecretA = dhA.computeSecret(keyB);
    const sharedSecretB = dhB.computeSecret(keyA);

    if (!sharedSecretA.equals(sharedSecretB)) {
        throw new Error("Shared secrets do not match!");
    }

    return sharedSecretA.slice(0, 32); // Lấy 256 bit làm khóa phiên
}

// Hàm tạo khóa AES riêng cho mỗi ghi chú
function generateUniqueKeyForNote(sessionKey, noteId) {
    const hash = crypto.createHash('sha256');
    hash.update(sessionKey);
    hash.update(noteId); // Sử dụng ID hoặc số nhận dạng duy nhất của ghi chú
    return hash.digest().slice(0, 32); // Tạo khóa 256 bit từ hash
}

// Hàm mã hóa AES
function encryptNote(note, uniqueKey) {
    const iv = crypto.randomBytes(16); // Tạo IV ngẫu nhiên
    const cipher = crypto.createCipheriv('aes-256-cbc', uniqueKey, iv);

    let encrypted = cipher.update(note, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        encryptedNote: encrypted,
        iv: iv.toString('hex') // Gửi IV kèm theo
    };
}

// Hàm giải mã AES
function decryptNote(encryptedData, uniqueKey) {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        uniqueKey,
        Buffer.from(encryptedData.iv, 'hex')
    );

    let decrypted = decipher.update(encryptedData.encryptedNote, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
module.exports = {
    generateSessionKeys,
    generateUniqueKeyForNote,
    encryptNote,
    decryptNote
};
