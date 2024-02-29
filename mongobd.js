const { json } = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const mongoErrorHandler = require('./mongoErrorHandler');
const {emailSender} = require("./mailSender")
const {jwtGenerate} = require("./jwtToken")
const {mongodbUrl, dbName, serverUrl} = require("./config");
const {apiResponse} = require("./apiResponse");
const customVerification = require('./customVerification');


const client = new MongoClient(mongodbUrl);

async function createUser(data){
    const userMail = data.email;
    const userName = data.username;
    try {
        const finduser = await client.db(dbName).collection('auth').findOne({email: data.email})
        if (finduser) {
            return {message: "Email account exist", err: true}
        }
        const data1 = await client.db(dbName).collection("auth").insertOne(data)
        const token = jwtGenerate(data1)
        const url = `http://${serverUrl}/verifyemail?token=${token}`
        const emailBody = customVerification(userName,url)
        await emailSender(userMail, emailBody, "Verification Email");
        //console.log(data1);
        return {message: "Account creation successfull", err: false, id: data1.insertedId}
        
    } catch (error) {
        return mongoErrorHandler(error)
    }
}

async function UpdateUserById(userData) {
    const {id, data, collection} = userData;
    if (!id || !data) {
        return (apiResponse("Data or Id missing", true, 406))
    }

    try {
        const updateComplete = await client.db(dbName).collection(collection).updateOne({_id: new ObjectId(id)}, {$set:data});
        if (updateComplete) {
            return (apiResponse("Update successfully", false, 204))
        }
        return (apiResponse("Id does not exist", true, 404))
    } catch (error) {
        console.log(error);
    }
}
async function findById(data) {
    const {id, collection} = data
    if (!id || !collection) {
        return undefined
    }
    try {
        const userData = await client.db(dbName).collection(collection).findOne({_id: new ObjectId(id)})
        if (userData) {
            return userData;
        }
        return undefined;
    } catch (error) {
        console.log(error);
    }
}

async function findByUserId(data) {
    const {id, collection} = data
    console.log(`user ${id}, collection ${collection}`);
    if (!id || !collection) {
        return undefined
    }
    try {
        const userData = await client.db(dbName).collection(collection).findOne({id: new ObjectId(id)})
        console.log(userData);
        if (userData) {
            return userData;
        }
        return undefined;
    } catch (error) {
        console.log(error);
    }
}

async function findByEmail(em) {
    const {email, collection} = em
    //console.log(em);
    if (!email || !collection) {
        return undefined
    }
    try {
        const userData = await client.db(dbName).collection(collection).findOne({email: email})
        if (userData) {
            return userData;
        }
        return undefined;
    } catch (error) {
        console.log(error);
    } 
}

async function findByEmailMany(em) {
    const {email, collection} = em
    //console.log(em);
    if (!email || !collection) {
        return undefined
    }
    try {
        const userData = await client.db(dbName).collection(collection).find({email: email}).toArray()
        if (userData) {
            return userData;
        }
        return undefined;
    } catch (error) {
        console.log(error);
    } 
}

async function createOrUpdateField(userData) {
    const {id, data, collection} = userData;
    if (!id || !data) {
        return (apiResponse("Data or Id missing", true, 406))
    }
    
    try {
        const updateComplete = await client.db(dbName).collection(collection).updateOne({_id: new ObjectId(id)}, {$set:data}, {upsert:true});
        if (updateComplete) {
            return (apiResponse("Update successfully", false, 204))
        }
        return (apiResponse("Id does not exist", true, 404))
    } catch (error) {
        console.log(error);
    }
}

async function insertData(data){
    try {
        const insertDa =  await client.db(dbName).collection("usersInfo").insertOne(data)
        if (insertDa) {
            return (apiResponse("Update successfully", false, 204))
        }
        return (apiResponse("Id does not exist", true, 404))
    } catch (error) {
        console.log(error);
    }
}

async function insertDataEmail(data){
    try {
        const insertDa =  await client.db(dbName).collection("usersAttandence").insertOne(data)
        if (insertDa) {
            return (apiResponse("Update successfully", false, 204))
        }
        return (apiResponse("Id does not exist", true, 404))
    } catch (error) {
        console.log(error);
    }
}

async function deleteField(userData) {
    const {id, data, collection} = userData;
    if (!id || !data) {
        return (apiResponse("Data or Id missing", true, 406))
    }
    
    try {
        const updateComplete = await client.db(dbName).collection(collection).updateOne({_id: new ObjectId(id)}, {$unset:data});
        if (updateComplete) {
            return (apiResponse("Update successfully", false, 204))
        }
        return (apiResponse("Id does not exist", true, 404))
    } catch (error) {
        console.log(error);
    }
}

async function updateDataUsingAny(userData, findby, collection ){
    try {
        const updateComplete = await client.db(dbName).collection(collection).updateOne(findby, {$set:userData});
        console.log(updateComplete);
        if (updateComplete) {
            return (apiResponse("Update successfully", false, 204))
        }
        return (apiResponse("Id does not exist", true, 404))
    } catch (error) {
        console.log(error);
    }
}
module.exports = {updateDataUsingAny,findByEmailMany,insertDataEmail,findByUserId, createUser, UpdateUserById, findByEmail, findById, createOrUpdateField, deleteField, insertData}