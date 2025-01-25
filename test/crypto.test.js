const cryptoModel = require('../models/aes');
const crypto = require('crypto');
const testData = require('./testCases.json'); // Importing the test data

describe('Crypto Model Tests', () => {
    let sessionKey;
    let noteId;
    let noteContent;
    let uniqueKey;

    beforeAll(() => {
        // Generate session keys before running tests
        sessionKey = cryptoModel.generateSessionKeys();
        noteId = testData.uniqueKeyTest.noteId; // Getting note ID from testCases.json
        noteContent = testData.encryptionDecryptionTest.noteContent; // Getting note content from testCases.json
        uniqueKey = cryptoModel.generateUniqueKeyForNote(sessionKey, noteId);
    });

    it('should generate session keys correctly', () => {
        expect(sessionKey).toBeDefined();
        expect(sessionKey.length).toBe(testData.sessionKeyTest.expectedLength); // Validate expected length from testCases.json
    });

    it('should generate a unique key for a note', () => {
        expect(uniqueKey).toBeDefined();
        expect(uniqueKey.length).toBe(testData.uniqueKeyTest.expectedLength); // Validate expected length from testCases.json
    });

    it('should encrypt and decrypt a note successfully', () => {
        const encryptedData = cryptoModel.encryptNote(noteContent, uniqueKey);
        expect(encryptedData).toHaveProperty('encryptedNote');
        expect(encryptedData).toHaveProperty('iv');

        const decryptedNote = cryptoModel.decryptNote(encryptedData, uniqueKey);
        expect(decryptedNote).toBe(testData.encryptionDecryptionTest.expectedDecryptedContent); // Validate decrypted content
    });

    it('should throw an error if the shared secrets do not match', () => {
        const wrongSessionKey = cryptoModel.generateSessionKeys();
        expect(() => {
            const wrongKey = cryptoModel.generateUniqueKeyForNote(wrongSessionKey, noteId);
            cryptoModel.encryptNote(noteContent, wrongKey); // Should not work with mismatched session key
        }).toThrow('Shared secrets do not match!');
    });
});
