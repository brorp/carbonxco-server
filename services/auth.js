const {Users} = require("../models/index");
const { signToken } = require('../helpers/jwt')
const { hash_password } = require('../helpers/hash')
class AuthService {
    static login = async (params, next) => {

        try {
            let response = await Users.findOne({
                where: {
                    email: params.email,
                },
                attributes: {exclude: 'user_id'}
            });

            if (!response || response.password !== hash_password(params.password)) {
                throw { message: 'Email or Password is incorrect', code: 401 }
            }

            const access_token = signToken({
                id: response.id,
                email: response.email,
                role: response.role
            })  
            return {
                access_token: access_token
            }

        } catch (error) {
            next(error)
        }

    }


}

module.exports = AuthService