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
const Post = require('../models/Post')

exports.mustBeLoggedIn = function(req,res,next){ //to restrict urls
    if(req.session.user){
        next()
    }else{
        req.flash("errors","You must be logged in to perform this Action")
        req.session.save(function(){
            res.redirect('/')
        })
    }
}
//Using a promise
exports.login = function(req,res){//This is what will be done in promise
    let user = new User(req.body) 
    user.login().then(function(result){
        req.session.user = {avatar: user.avatar, username: user.data.username, _id: user.data._id} //This is how the sessiion is leverged
        req.session.save(function(){ //The above will auto save, but we will save manually and then gve the asyn function some time to do it and then redirect to the url
            res.redirect('/')
        }) //If it is resolves
    }).catch(function(err){
        req.flash('errors',err) // This will create a flash package with the err mesg, we can use anything instead od 'errors', this is the collection name
        //req.session.flash.errors = [err] //This is what is done actually in flash
        req.session.save(function(){ //This is the call back func
            res.redirect('/')
        })
        //res.redirect('/') We need to give time to redirect, so manual save and thn redirect
        //res.send(err)//If it is rejected
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
    user.register().then(()=>{
        req.session.user = {avatar: user.avatar, username: user.data.username,  _id: user.data._id} //User id added
        req.session.save(function(){
            res.redirect('/')
        })
    }).catch((regErrors)=>{
        regErrors.forEach(function(err){
            req.flash('RegErrors',err)
        })
        req.session.save(function(){
            res.redirect('/')
        })
    })
    
}

    /*
    if (user.errors.length>0){ //if the array is not empty we send the error
        

        /*THis can also be done but it will show mesg individually
        req.flash('errors',user.errors)
        req.session.save(function(){
            res.redirect('/')
        })
        */
        //res.send(user.errors)
    /*
    } else {
        res.send("Congrats") //Else sucess
    }
    */
    //user.homePlanet //explanation
    //user.jump()
    // console.log(req.body)  //TEST LINE after adding the two blah line the console shows the object with data
    //res.send("Thanks for registering bitch")


exports.home = function(req,res){
    if (req.session.user){
        res.render('userhome') //If it is inside a session //The true is returned to controller the header
    }else{
        res.render('index', {errors: req.flash('errors'), regErrors: req.flash('RegErrors')}) //Else show this
    }
}

exports.ifUserExist = function(req,res,next){ 
    User.findByUsername(req.params.username).then(function(userDoc){ //params is the value with :
        req.profileUser = userDoc //assign the return to req
        next() //go to next
    }).catch(function(){
        res.render('404')
    })
}

exports.profileScreen = function(req,res){
    Post.findByAuthorId(req.profileUser._id).then(function(posts){
        res.render('profile',{
            posts: posts,
            profileUsername: req.profileUser.username,
            profileAvatar: req.profileUser.avatar
        })
    }).catch(function(){
        res.render('404')
    })
}
