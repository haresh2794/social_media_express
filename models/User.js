const bcrypt = require("bcryptjs") //Hashing package
const userCollection = require('../db').db().collection('users')
//const userCollection = require('../db').collection('users')
const validator = require("validator")
const User = function(data){ //This is the constructor
    this.data = data
    this.errors = [] //We use this at validation
}

User.prototype.cleanUp = function(){ //Cleaning up before validation
   //Username, email, pass should be a string
    if(typeof(this.data.username) != 'string'){this.data.username = ""} 
    if(typeof(this.data.email) != 'string'){this.data.email = ""} 
    if(typeof(this.data.password) != 'string'){this.data.password = ""} 

    //get rid of any bogus properties ,example is user send a name: Haresh
    this.data = {
        username: this.data.username.trim().toLowerCase(), //getting rid of spaces trim() and convrt to lowercase
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password 
    }
}


//Validation
User.prototype.validate = function(){
    return new Promise(async (resolve,reject) => { //Validating the data
    if (this.data.username == ""){this.errors.push("You must enter a valid username")} //we are adding to the array of errors
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)){this.errors.push("Uesr name can only contain letters and numbers")}
    if (!validator.isEmail(this.data.email)){this.errors.push("You must enter a valid email")} //is a valid email
    //if (this.data.email == ""){this.errors.push("You must enter a valid email")}
    if (this.data.password == ""){this.errors.push("You must enter a password")}
    if (this.data.password.length > 0 && this.data.password.length <12){this.errors.push("password must be atleast 12 charaters")}
    if (this.data.password.length>50) {this.errors.push("Too Long password cannot exceed 50 char")}
    if (this.data.username.length > 0 && this.data.username.length <3){this.errors.push("username must be atleast 3 charaters")}
    if (this.data.username.length>30) {this.errors.push("Too Long Username")}


    //Only if username is vvalid then check to see if it is already taken
    if(this.data.username.length>2 && this.data.username.length<31 && validator.isAlphanumeric(this.data.username)){
        let usernameExists = await userCollection.findOne({username: this.data.username}) //Here we are using the promise feature so we put a await and change the main func to async
        if (usernameExists){this.errors.push("Username taken")} //This will execute after the above
    }
    //Only if email is vvalid then check to see if it is already taken
    if(validator.isEmail(this.data.email)){
        let emailExists = await userCollection.findOne({email: this.data.email}) //Here we are using the promise feature so we put a await and change the main func to async
        if (emailExists){this.errors.push("Email already taken")} //This will execute after the above
    }
    resolve()
    })
}


//Registering
User.prototype.register = function(){
    return new Promise(async (resolve,reject) => {
    //Step 1 = Validate User data
    this.cleanUp()
    await this.validate() //Since we added async func we need to make sure this func is completed before moving to

    //Step 2 = Only if there are no validation errors
    //Save user data into a database
    if(!this.errors.length){
        //Hashing the password, Using a bcrypt is a two step process
        let salt = bcrypt.genSaltSync(10) //Step 1 creating the salt
        this.data.password = bcrypt.hashSync(this.data.password,salt) // Updating the password with salt
        await userCollection.insertOne(this.data) //This will run to save to the DB is there is no error
        resolve()
    } else{
        reject(this.errors)
    }
    })
}

//Creating a promise
User.prototype.login = function(){
    return new Promise((resolve,reject)=>{ //We are using the arrow function to keep this keyword stable
        this.cleanUp() //Resolve will send a positive message, and reject will send a negagtive msg, resolve and reject are indust standard
        userCollection.findOne({username: this.data.username}).then((attemtedUser)=>{
            if (attemtedUser && bcrypt.compareSync(this.data.password,attemtedUser.password)){ //using Hash comparison //attemtedUser.password == this.data.password We deleted this after &&
                resolve("Congratsx") 
            }else{
                reject("Invalid Username/Password")
            }
        }).catch(function(){
            reject("Please try again Later")
        })
    })


}


/**
TRADITIONAL CALL BACK APPROCH
User.prototype.login = function(callback){
    //clean up
    this.cleanUp()
    //Check for username //Here the ob created in the post will be passed to the attemtedUser 
    userCollection.findOne({username: this.data.username},(err,attemtedUser) => {//it doesnot or change the this. If we use function we might encounter problems where this keyword will point global variable
        if (attemtedUser && attemtedUser.password == this.data.password){
            callback("Congratsx") //Callback will send the result in Usercontroller as a return to the function under user.login(function(result{ fasssdfhfliewiu})).
        }else{
            callback("HOLYSHIT WROOONG")
        }
    })
}
*/

module.exports = User // This will require to connect into a other file,, here it is controller



/*
let User = function(){ //This will be the blue print for our user object
    //this.homePlanet = "earth" // Here when an obj is created it will have an attribute where homePlnt is earth
                                //this keyword will point towards the obj is working on at that moment
    //this.jump = function(){} //It we want to create a method withing the object we can do this. But it will create to every obj. and that is not good in computer perspective
}


User.prototype.jump = function(){} //This is the recommend way so every obj created will have access to this method. But each obj will not have a seperate jump()

*/