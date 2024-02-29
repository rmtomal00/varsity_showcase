const { json } = require("express");
const ph = require("password-hash-with-salt")

    async function userPassword(p){
        const password = await ph.generate(p);
        return password;
    }

    async function userDataModel(username, email, password, phoneNumber, dateOfBirth){
        return {
            username: username,
            email: email,
            password: await userPassword(String(password)),
            phoneNumber: phoneNumber,
            dateOfBirth: dateOfBirth,
            role: "user",
            isEmailVerify: false,
            isDisable: false,
            isKycEnable: false,
            isPhoneNumberVarify: false,
            createTime: Date.now(),
            lastLogin: 0,
            lastUpdateProfile: 0,
        }
    }

module.exports = { userDataModel, userPassword}