/*
The study test code ========== 

console.log("I am excecuted") //
module.exports = { //this will when it is called inside the file
    meow: function(){
        console.log("Helloo")
    }
} 
*/

const express = require('express')
const router = express.Router() //This will export a mini app kindof thing to routtes This is the Router Express

router.get('/', function(req,res){ //The functions needs to be sent to a controller, Here we will organize the url routing
    res.render('index')
})

router.get('/about',function(req,res){
    res.send("This is about")
})
module.exports = router


