const {Users} = require("../models/index");
const { signToken } = require('../helpers/jwt')
const { comparePassword } = require('../helpers/hash')
class AuthService {
    static login = async (params, next) => {

        try {
            let response = await Users.findOne({
                where: {
                    email: params.email,
                }
            });

            if(response && comparePassword(params.password, response.password)){
                const access_token = signToken({
                    id: response.id,
                    email: response.email,
                    role: response.role
                })  
                return {
                    access_token: access_token
                }
            }

            else {
                throw { code: 401, message: 'Email or Password is incorrect' }
            }

        } catch (error) {
            next(error)
        }

    }
}

module.exports = AuthService