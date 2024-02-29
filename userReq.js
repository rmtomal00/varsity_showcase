const userRoute = require('express').Router()
const { json, urlencoded } = require('express');
const middleware = require('./userRequestCheck');
const { jwtVerify } = require('./jwtToken');
const { findById, findByUserId, findByEmail, findByEmailMany } = require('./mongobd');
const { userResponse } = require('./responseAll');
const { apiResponse } = require('./apiResponse');

userRoute.use(json());
userRoute.use(urlencoded({extended: true}))
userRoute.use(middleware)


userRoute.all('/get-user-info' , async (req , res)=>{

    try {
        const {token} = req.body;
        const userId = jwtVerify(token);
        console.log(userId);
        const dbToInfo = await findByUserId({id: userId.id, collection: "usersInfo"})
        console.log(dbToInfo);
        if (dbToInfo) {
            res.status(200).json(userResponse("Data get Successfully", 200, false, dbToInfo))
            return
        }
        res.status(400).json(apiResponse("User Id not found", true, 400))
    } catch (error) {
        console.log(error);
        res.status(400).json(apiResponse("Unknown error", true, 400))
    }
    
})


userRoute.all('/get-data' , async (req , res)=>{
    const {email} = req.body;
    try {
        const data = await findByEmailMany({email: email, collection: "usersAttandence"})
        console.log(data);
        res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.status(400).json(apiResponse("server error", true, 400))
    }
})

module.exports  = userRoute