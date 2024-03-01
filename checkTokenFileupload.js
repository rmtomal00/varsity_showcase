//this is for user upload security code if you want to add this you need to add the token to the header for calling api



const { apiResponse } = require("./apiResponse");
const { jwtVerify } = require("./jwtToken");
const { findById } = require("./mongobd");

module.exports =async (req, res, next)=>{
    var bearToken = String(req.headers.authorization);

    const token1 =  bearToken.split(" ")[1];
    console.log(token1);
    console.log(req.body);
    try {
        if (!token1) {
            res.status(401).json(apiResponse("Verification token missing", true, 401));
            return;
        }
    
        const userTokenData = jwtVerify(token1);
        //console.log(userTokenData);
        if (!userTokenData) {
            res.status(498).json(apiResponse("Invalid token", true, 498));
            return;
        }
        const getData = await findById({id:userTokenData.id, collection: 'auth'});
        //console.log(getData);
        if (getData) {
            if (getData.userToken !== token1) {
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