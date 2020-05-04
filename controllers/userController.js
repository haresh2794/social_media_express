//This is for the user feature

/*
//This is one way we can create a module where it is called when the file is called from a another file.We can use export so the func will run
module.exports = {
    login: function(){},
    logout: function(){}
}
//But this is not the standard
*/


exports.login = function(){
    
}

exports.logout = function(){
    
}

exports.register = function(req,res){
    res.send("Thanks for registering bitch")
}

exports.home = function(req,res){
    res.render('index')
}