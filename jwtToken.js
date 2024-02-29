const jwt = require("jsonwebtoken");
const {jwtSecret} = require("./config")


function jwtGenerate(data) {
    const token = jwt.sign(data, jwtSecret, {expiresIn: "24h", algorithm: "HS256"})
    if (token) {
        return token;
    }
    console.log(token);
} 

function jwtVerify(token) {
    if (!token) {
        return { message:"Token not found", err: true}
    }
    try {
        const tokenVerify = jwt.verify(token, jwtSecret);
        //console.log(tokenVarify);
        if (tokenVerify) {
            return tokenVerify
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {jwtGenerate, jwtVerify}