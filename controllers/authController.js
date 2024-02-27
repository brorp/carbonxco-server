const AuthService = require('../services/auth')

class AuthController {
    static login = async(req, res, next) => {
        try {
            let params = req.parameters;
            params = params.permit(
                "email",
                "password",
            ).value()

            let data = await AuthService.login(params, next)
            if(data){
                res.status(201).json(data)
            }   

        } catch (error) {
            next(error)
        }
    }
}

module.exports = AuthController