const {apiResponse} = require('./apiResponse');
const emailValid = require('email-validator');

module.exports = (req, res, next)=>{
    const {username, email, password, dateOfbirth = "2002-12-31", phoneNumber} = req.body;
        if (!username || !email || !password || !dateOfbirth || !phoneNumber) {
        throw res.status(403).json(apiResponse("Account creation unseccesfull for invalid json",true, 403))
    }
    if (!emailValid.validate(email)) {
        res.status(401).json(apiResponse("Email invalid", true, 401));
        return
    }
    
    if (String(password).length < 6) {
        res.status(401).json(apiResponse("Password is less then 6 cherecter", true, 401));
        return
    }
    next();
    //res.send("error");
}
