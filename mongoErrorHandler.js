const { json } = require("express")

module.exports = function err(err){
    throw {message: err}
}