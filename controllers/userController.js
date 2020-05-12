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

//Using a promise
exports.login = function(req,res){//This is what will be done in promise
    let user = new User(req.body) 
    user.login().then(function(result){
        req.session.user = {favColor: "Blue", username: user.data.username} //This is how the sessiion is leverged
        req.session.save(function(){ //The above will auto save, but we will save manually and then gve the asyn function some time to do it and then redirect to the url
            res.redirect('/')
        }) //If it is resolves
    }).catch(function(err){
        res.send(err)//If it is rejected
    }) 

}

/**
 Call Back APPROCH
exports.login = function(req,res){
    let user = new User(req.body) //We are calling the model file
    user.login(function(result){
        res.send(result) //We do this after the User.js does the thing. This is the traditional approch
    }) //We will create a login function in the model

}
*/
exports.logout = function(req,res){
    req.session.destroy(function(){ //Now we redirect after the destroy
        res.redirect('/')
    })
    
    //res.send("You are now logged out")
}

exports.register = function(req,res){
    let user = new User(req.body) //the new operator will create a object with User() blueprint WE CAPITALIZE BLUE PRINT
    user.register()
    if (user.errors.length>0){ //if the array is not empty we send the error
        res.send(user.errors)
    } else {
        res.send("Congrats") //Else sucess
    }
    //user.homePlanet //explanation
    //user.jump()
    // console.log(req.body)  //TEST LINE after adding the two blah line the console shows the object with data
    //res.send("Thanks for registering bitch")
}

exports.home = function(req,res){
    if (req.session.user){
        res.render('userhome',{userlog: true, username: req.session.user.username}) //If it is inside a session //The true is returned to controller the header
    }else{
        res.render('index', {userlog: false}) //Else show this
    }
}