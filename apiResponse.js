const { json } = require("express")

let apiResponse = (message, bool, code)=>{
    return {
        message: message,
        code: code,
        error: bool
    }
}
module.exports ={apiResponse}