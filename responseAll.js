function userResponse(message, code, bool, data) {
    return{
        message: message,
        code: code,
        error: bool,
        data: data
    }
}

module.exports = {userResponse}