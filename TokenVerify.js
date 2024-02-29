const {apiResponse} = require('./apiResponse')
const {jwtVerify} = require("./jwtToken")

module.exports =(req, res, next)=>{

    const {token} = req.query;

    try {
        if (!token) {
            res.status(401).json(apiResponse("Verification token missing", true, 401));
            return;
        }
    
        const userTokenData = jwtVerify(token);
        if (!userTokenData) {
            res.status(498).json(apiResponse("Invalid token", true, 498));
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(498).json(apiResponse("Unkonw error token", true, 498));
    }

}