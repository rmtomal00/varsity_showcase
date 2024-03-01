<h3>Face recognization app backend and Android front-end</h3>

Download this project to you IDE. It's base on nodejs express so that you need to preinstall Node js. 
Then go to <b>config.js file change mongodb url, change the db name and JWT token Secret also change the server IP, change the path (For windows like C:User/rmtomal/varsity_showcase/upload/)</b>. You will get your ip address using cmd <code>ifconfig</code> 

Now change the mailSender.js file

If you had done everything successfully. Now run command <code>npm i</code> <br>
Then start the server using. <code>node app.js</code>

Go to the <b>python_flask_code</b>
Let's start the second python script. It is a flask server so you need to install <code>pip install flask</code>, <code>pip install dlib</code>, <code>pip install face-recognition</code>. Once install done. Now run the server using this cmd line: <code>python3 -u contest.py</code>

Once run all perfectly. You can import postman api json on postman then test api.

So that let's do the next part.
<b>Download the Android app</b> using this link <link> https://github.com/rmtomal00/Attandence_app.git</link>

Now open it in Android studio.
Here, will get file call <b>local.properties</b> Change the <code>ip</code> here also from API_URL . Rebuild the app from <code> Build -> Rebuild. If not get API_URL add this code <br>
<code>API_URL=http://192.168.1.29:30001/api/v1</code>.

Let's run the app and enjoy everything using face varification.
