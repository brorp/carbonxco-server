const crypto = require('crypto');
// const comparePassword = (password, hashedPass) => {
//     return bcrypt.compareSync(password, hashedPass)
// }

const hash_password = (password) => {
    const secret = process.env.CRYPTO_SECRET
    const hash =  crypto.createHmac('sha256', process.env.CRYPTO_SECRET)
                        .update(password)
                        .digest('hex')
    return hash
}
module.exports = { hash_password }