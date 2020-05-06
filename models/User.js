/*
let User = function(){ //This will be the blue print for our user object
    //this.homePlanet = "earth" // Here when an obj is created it will have an attribute where homePlnt is earth
                                //this keyword will point towards the obj is working on at that moment
    //this.jump = function(){} //It we want to create a method withing the object we can do this. But it will create to every obj. and that is not good in computer perspective
}


User.prototype.jump = function(){} //This is the recommend way so every obj created will have access to this method. But each obj will not have a seperate jump()

*/
const userCollection = require('../db').collection('users')
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
User.prototype.validate = function(){ //Validating the data
    if (this.data.username == ""){this.errors.push("You must enter a valid username")} //we are adding to the array of errors
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)){this.errors.push("Uesr name can only contain letters and numbers")}
    if (!validator.isEmail(this.data.email)){this.errors.push("You must enter a valid email")} //is a valid email
    //if (this.data.email == ""){this.errors.push("You must enter a valid email")}
    if (this.data.password == ""){this.errors.push("You must enter a password")}
    if (this.data.password.length > 0 && this.data.password.length <12){this.errors.push("password must be atleast 12 charaters")}
    if (this.data.password.length>100) {this.errors.push("Too Long password")}
    if (this.data.username.length > 0 && this.data.username.length <3){this.errors.push("username must be atleast 3 charaters")}
    if (this.data.username.length>30) {this.errors.push("Too Long Username")}

}


//Registering
User.prototype.register = function(){
    //Step 1 = Validate User data
    this.cleanUp()
    this.validate()

    //Step 2 = Only if there are no validation errors
    //Save user data into a database
    if(!this.errors.length){
        userCollection.insertOne(this.data) //This will run to save to the DB is there is no error
    }
}

module.exports = User // This will require to connect into a other file,, here it is controller