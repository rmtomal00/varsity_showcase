const express = require('express')
const app = express()
const port = 30001
const auth = require('./auth')
const {UpdateUserById, findById} = require("./mongobd")
const {jwtVerify} = require('./jwtToken');
const emailV = require("./TokenVerify")
const userRoute = require('./userReq')
const fileUpload = require('./fileupload')

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/file", fileUpload);
app.get('/', (req, res) => {
    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 600000), httpOnly: true })
    res.send('Hello World!'+req.body); 
    console.log(req.body);})

app.get("/verifyemail",emailV, async(req, res)=>{

    const {token} = req.query
    try {
        const decode = jwtVerify(token);
    //console.log(decode);
    
        let updateValue = {
            id: decode.insertedId,
            data:{isEmailVerify:true},
            collection: "auth"
        }

        let quary = {
            id: decode.insertedId,
            collection: "auth"
        }
        const emailVrifyStatus = await findById(quary);
        if (emailVrifyStatus) {
            if (emailVrifyStatus.isEmailVerify) {
                res.send("You have already verified your account")
                return
            }
        }else if (!emailVrifyStatus) {
            res.send("ID not found")
                return
        }
        const emailVarify = await UpdateUserById(updateValue)
        if (emailVarify) {
            if(!emailVarify.error){
                res.send("Email account verification successfully done")
                return
            }
        }
    } catch (error) {
        console.log(error);
        res.send("Internal error of server for email verification")
    }
    
})

app.all("/confirm-password", emailV, async (req, res)=>{
    const {token} = req.query;
    try {
        const decode = jwtVerify(token);
        const id = decode.id;
        const userData = await findById({id: id, collection: 'auth'})
        //console.log(userData);
        if (!userData) {
            res.status(400).send("User Not Found")
            return;
        }
        if (!userData.resetToken) {
            res.status(400).send("Link already used")
            return;
        }
    
        const uToken = token;
        res.send(`
        <script>
          function validateForm() {
            var password = document.getElementById('password').value;
            var confirmPassword = document.getElementById('confirmPassword').value;
            if (String(password).length < 6) {
                alert('Password length less then 6 charecter');
                return false;
            }
    
            if (password !== confirmPassword) {
              alert('Passwords do not match');
              return false;
            }
    
            return true;
          }
        </script>
    
        <form action="/api/v1/auth/set-password" enctype="multipart/from-data" method="post" onsubmit="return validateForm()">
          <label for="password">New Password:</label>
          <input type="password" id="password" name="password" required>
          <br>
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required>
          <br>
          <button type="submit">Submit</button>
          <input type="hidden" name="userId" value="${id}">
          <input type="hidden" name="token" value="${uToken}">
        </form>
      `);
    } catch (error) {
        console.log(error);
        res.status(400).send("Unkonwen error")
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))