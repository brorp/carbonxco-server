const crypto = require('crypto');
const secretCrypto = process.env.CRYPTO_SECRET

const hash_password = (password) => {
    const hash =  crypto.createHmac('sha256', "bandung")
                        .update(password)
                        .digest('hex')
    return hash
}
module.exports = { hash_password }