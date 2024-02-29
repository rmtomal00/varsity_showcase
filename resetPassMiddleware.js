const {apiResponse} = require("./apiResponse")
const emailValid = require('email-validator')

module.exports = (req, res, next) =>{
    const {email} = req.body;
    //console.log(email);
    try {
        if (!email) {
            res.status(422).json(apiResponse("Email required", true, 422));
            return
        }
        if (!emailValid.validate(email)) {
            res.status(422).json(apiResponse("Email invalid", true, 422));
            return
        }
        next()
    } catch (error) {
        console.log(error);
        res.status(520).json(apiResponse("Unknowen error", true, 520));
    }
}