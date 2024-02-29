const router = require('express').Router()
const {apiResponse} = require('./apiResponse');
const d = require('./signupcheckdata');
const { createUser, findByEmail, findById, UpdateUserById, createOrUpdateField, deleteField, insertData } = require('./mongobd');
const {userDataModel, userPassword} = require("./userModel")
const emailRequireCheck = require("./resetPassMiddleware");
const {jwtGenerate, jwtVerify} = require('./jwtToken')
const {serverUrl, jwtSecret} = require('./config')
const {emailSender}  = require("./mailSender");
const { customEmail } = require('./forgetPasswordEmail');
const tokenVerify = require('./tokenVerifyBody');
const ph = require('password-hash-with-salt');
const cookieParser = require('cookie-parser');
const { userResponse } = require('./responseAll');
const userRequestCheck = require('./userRequestCheck');
const customVerification = require('./customVerification');


router.use(require("express").json())
router.use(require("express").urlencoded({extended: true}))
router.use(cookieParser())


router.all('/signup' , d, async function(req, res){
    // router code here
        try {
            const {username, email, password, dateOfbirth = "2002-12-31", phoneNumber, photo} = req.body;
            const data = await userDataModel(username, email, password, phoneNumber, dateOfbirth);
            const userCreate = await createUser(data)
            if(!userCreate.err){
                await insertData({id: userCreate.id, userName: username, userMail: email, userPhone: phoneNumber, birthDate: dateOfbirth, photo: "http://"+serverUrl+"/api/v1/file/photos/"+photo, status: true, photoPath: "/home/rmtomal/nodejs_projects/varsity_showcase/uploads/"+photo, getAttandence: true})  //change this location use where image are storeing "/home/rmtomal/nodejs_projects/varsity_showcase/uploads/"" 
                res.status(201).json(apiResponse(userCreate.message, false, 201))
                return
            }
            res.status(409).json(apiResponse(userCreate.message, true, 409));
        } catch (error) {
            console.log(error);
            res.status(403).json(apiResponse("Unknowen error",true, 403))
        }
        

})


router.all('/login' , async function data(req , res){
    const {email, password} = req.body;
    console.log(req.body);
    try {
        if (!email || !password) {
            res.status(400).json(userResponse("Password or Email invalid", 400, false, null));
            return
        }
        const data = await findByEmail({email: email, collection: "auth"})
        if (data) {
            if (!data.isEmailVerify) {
                res.status(200).json(userResponse("Email not verified", 200, true, null))
                return
            }
            if(await ph.verify(String(password), data.password.hash, data.password.salt)){
                const token = jwtGenerate({email: data.email, id: data._id})
                await createOrUpdateField({id: data._id, data:{userToken: token, lastLogin: Date.now()}, collection: 'auth'});
                res.status(200).json(userResponse("Login successful", 200, false, {token: token}))
            }else{
                res.status(401).json(userResponse("Password not match", 401, true, null))
            }
        }else{
            res.status(400).json(userResponse("Email not found", 400, true, null))
        }
    } catch (error) {
        console.log(error);
        res.status(493).json(apiResponse("Unknowen error",true, 493))
    }
})

router.all('/logout',userRequestCheck, async (req, res)=>{
    const {token} = req.body;
    try {
        const tokenData = jwtVerify(token);
        const userData = await deleteField({id: tokenData.id, data:{userToken: ""}, collection: 'auth'})
        if (!userData) {
            res.status(400).json(apiResponse("Logout failed", true, 400))
            return
        }
        res.status(200).json(apiResponse("Logout successful", false, 200))
    } catch (error) {
        console.log(error);
        res.status(493).json(apiResponse("Unknowen error",true, 493))
    }

})

router.all("/resend-verification-mail", async (req, res)=>{
    const{email} = req.body
    if (!email) {
        res.status(400).json(apiResponse("User Email invalid", true, 400))
        return
    }

    try {
        const data = await findByEmail({email: email, collection: "auth"});

        if (!data) {
            res.status(404).json(apiResponse("Email not found", true, 404))
            return
        }
        if (data.isEmailVerify) {
            res.send("You have already verified your account")
            return
        }
    
        const token = jwtGenerate({insertedId: data._id.toHexString()})
        const url = `http://${serverUrl}/verifyemail?token=${token}`
        const emailBody = customVerification(data.username, url)
        await emailSender(email, emailBody, "Verification Email");
        res.status(200).json(apiResponse("Email send", false, 200))
    } catch (error) {
        console.log(error);
        res.status(493).json(apiResponse("Unknowen error",true, 493))
    }
})

router.all("/reset-password", emailRequireCheck, async (req,res)=>{
    const {email} = req.body;
    try {
        const data = {
            email: email,
            collection: "auth"
        }
        const findUser = await findByEmail(data)
        //console.log(findUser);
        if (!findUser) {
            res.status(404).json(apiResponse("User not found", true, 404));
            return
        }
        const {_id, username} = findUser;
        const uid = _id.toHexString();
        const d = {
            id: uid,
            user: username
        }
        
        const token = jwtGenerate(d);
        await createOrUpdateField({id:uid, data:{resetToken: token}, collection: "auth"})
        const link = `http://${serverUrl}/confirm-password?token=${token}`;
        const preload = {name: username, url: link};
        const emailData = customEmail(preload);
        await emailSender(email, emailData, "Forget Password mail");
        res.status(200).json(apiResponse("Reset email has sent. Please check email.", false, 200))
    } catch (error) {
        console.log(error);
        res.status(520).json(apiResponse("Unknowen error", true, 520));
    }


})

router.all('/set-password', tokenVerify, async (req, res)=>{
    const {password, confirmPassword, userId, token} = req.body;
    if (!password || !confirmPassword || !userId || !token) {
        res.status(422).send("Data missinng")
        return
    }

    if (password !== confirmPassword) {
        res.status(400).send("Confirm password not match");
        return
    }
    try {
        const decode = jwtVerify(token);
        if (decode.id !== userId) {
            res.status(400).send("ID not match");
            return
        }

        const data = await findById({id: userId, collection: "auth"});
        if (!data) {
            res.status(400).send("ID not valid");
            return
        }
        const newPassword = await ph.generate(password);
        const update = await UpdateUserById({id: userId, data: {password: newPassword, lastUpdateProfile: Date.now()}, collection: "auth"});
        const deleteData = await deleteField({id: decode.id, data:{resetToken:""}, collection: "auth"});
        //console.log(deleteData);
        if (!update.error) {
            console.log(update.message);
            res.status(200).send("Update successfylly");
            return
        }else{
            console.log(update.message);
            res.status(200).send("Update failed");
        }
    } catch (error) {
        console.log(error);
        res.status(520).json(apiResponse("Unknowen error", true, 520));
    }
    //console.log(update);
})

router.all('/token-ckeck', userRequestCheck, (req, res)=>{
    res.status(200).json(apiResponse("Token Valid", false, 200))
})


module.exports  = router
