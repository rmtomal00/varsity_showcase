function customEmail(data){
    const {name = "User", url} = data;
    const emailBody = `Hi ${name}\nThank you for use our service. Your forget password link\n ${url}`
    return emailBody;
}

module.exports = {customEmail}