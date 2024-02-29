const { apiResponse } = require("./apiResponse");
const { jwtVerify } = require("./jwtToken");
const { findById } = require("./mongobd");

module.exports =async (req, res, next)=>{
    const {token} = req.body
    console.log(req.body);
    try {
        if (!token) {
            res.status(401).json(apiResponse("Verification token missing", true, 401));
            return;
        }
    
        const userTokenData = jwtVerify(token);
        //console.log(userTokenData);
        if (!userTokenData) {
            res.status(498).json(apiResponse("Invalid token", true, 498));
            return;
        }
        const getData = await findById({id:userTokenData.id, collection: 'auth'});
        //console.log(getData);
        if (getData) {
            if (getData.userToken !== token) {
                res.status(498).json(apiResponse("Tokend not match", true, 498));
                return;
            }
            if(getData.isDisable){
                res.status(200).json(apiResponse("Account is disable", true, 200));
                return;
            }
            next();
        }else{
            res.status(498).json(apiResponse("User has not account", true, 498));
            return;
        } 
    } catch (error) {
        console.log(error);
        res.status(498).json(apiResponse("Unkonw error token", true, 498));
    }
}