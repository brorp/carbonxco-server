var CryptoJS = require("crypto-js");

const comparePassword = (string) => {
    var bytes  = CryptoJS.AES.decrypt(string, process.env.CRYPTO_KEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText
}

const getSalt = (string) => {
    var ciphertext = CryptoJS.AES.encrypt(string, process.env.CRYPTO_KEY);
    return ciphertext
}

module.exports = { getSalt, comparePassword }