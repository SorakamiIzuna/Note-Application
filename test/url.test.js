require('dotenv').config();
const crypto = require('crypto');
const { generateURL, verifyURL, addURLToDatabase } = require('../models/tempURLModels.js');
const shareNote = require('../models/shareModels.js');
const testCases = require('./testCases.json');

jest.mock('../models/shareModels.js'); // Mock the database model

describe('Temporary URL Utilities with testCases.json', () => {
    const SECRET_KEY = process.env.SECRET_KEY || 'test_secret_key';

    beforeAll(() => {
        process.env.SECRET_KEY = SECRET_KEY; // Ensure SECRET_KEY is set for testing
    });

    describe('generateURL', () => {
        testCases.generateURL.forEach(({ noteID, expirationSeconds, iv, expectedSubstring }) => {
            it(`should generate URL containing '${expectedSubstring}'`, () => {
                const url = generateURL(noteID, expirationSeconds, iv);
                expect(url).toContain(expectedSubstring);
            });
        });
    });

    describe('verifyURL', () => {
        testCases.verifyURL.forEach(({ description, noteID, expirationSeconds, iv, tamper, isValid }) => {
            it(`should verify URL correctly: ${description}`, () => {
                const url = generateURL(noteID, expirationSeconds, iv);

                const testURL = tamper
                    ? url.replace(/signature=[^&]+/, 'signature=invalidsignature')
                    : url;

                const result = verifyURL(testURL);
                expect(result).toBe(isValid);
            });
        });
    });

    describe('addURLToDatabase', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        testCases.addURLToDatabase.forEach(({ description, noteID, iv, existingNote, shouldUpdate }) => {
            it(description, async () => {
                shareNote.findById.mockResolvedValueOnce(existingNote);

                if (existingNote && shouldUpdate) {
                    existingNote.save = jest.fn().mockResolvedValue({
                        _id: noteID,
                        url: expect.any(String),
                    });
                }

                const response = await addURLToDatabase(noteID, iv);

                if (existingNote === null) {
                    expect(shareNote.findById).toHaveBeenCalledWith(noteID);
                    expect(response.url).toContain(noteID);
                    expect(response.url).toContain('expires=');
                } else if (shouldUpdate) {
                    expect(existingNote.save).toHaveBeenCalled();
                    expect(response.url).toContain(noteID);
                } else {
                    expect(response.url).toEqual(existingNote.url);
                }
            });
        });
    });
});
