//This is for the user feature

/*
//This is one way we can create a module where it is called when the file is called from a another file.We can use export so the func will run
module.exports = {
    login: function(){},
    logout: function(){}
}
//But this is not the standard
*/

const User = require('../models/User') //We need to mode a folder up... That why we have two dots

exports.login = function(){
    
}

exports.logout = function(){
    
}

exports.register = function(req,res){
    let user = new User(req.body) //the new operator will create a object with User() blueprint WE CAPITALIZE BLUE PRINT
    user.register()
    
    //user.homePlanet //explanation
    //user.jump()
    // console.log(req.body)  //TEST LINE after adding the two blah line the console shows the object with data
    res.send("Thanks for registering bitch")
}

exports.home = function(req,res){
    res.render('index')
}