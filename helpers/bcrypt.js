const bcrypt = require('bcrypt');

const comparePassword = (password, hashedPass) => {
    return bcrypt.compareSync(password, hashedPass)
}

const getSalt = (userPassword) => {
    return bcrypt.hashSync(userPassword, 10)
}

module.exports = { getSalt, comparePassword }