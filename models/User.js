/*
let User = function(){ //This will be the blue print for our user object
    //this.homePlanet = "earth" // Here when an obj is created it will have an attribute where homePlnt is earth
                                //this keyword will point towards the obj is working on at that moment
    //this.jump = function(){} //It we want to create a method withing the object we can do this. But it will create to every obj. and that is not good in computer perspective
}


User.prototype.jump = function(){} //This is the recommend way so every obj created will have access to this method. But each obj will not have a seperate jump()

*/

const User = function(data){
    this.data = data


}

User.prototype.register = function(){
    
}

module.exports = User // This will require to connect into a other file,, here it is controller