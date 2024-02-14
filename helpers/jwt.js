const jwt = require('jsonwebtoken')
const key = process.env.CARBONXCO_TOKEN

const signToken = (data) => {
    return jwt.sign(data, key, {expiresIn: '30d'})
}

const verifyToken = (token) => {
    return jwt.verify(token, key)
}

const signPasswordLink = (data, password) => {
    return jwt.sign(data, (key + password), {expiresIn: '15m'})
}

const verifyLink = (token, password) => {
    return jwt.verify(token, (key + password))
}

const decodeJwt = (token) => {
    return jwt.decode(token)
}

module.exports = {signToken, verifyToken, signPasswordLink, verifyLink, decodeJwt}