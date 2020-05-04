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
const userController = require('./controllers/userController')


router.get('/', userController.home)

router.post('/register',userController.register) //We forwarded the register form action to the /register url. Here we use the function in the userController




/*
BEFORE CONTROLLERS WERE ADDED
router.get('/', function(req,res){ //The functions needs to be sent to a controller, and should not have the function Here we will organize the url routing
    res.render('index')
})
*/

/*
router.get('/about',function(req,res){
    res.send("This is about")
})
*/
//router.post('/create-post',postController.create) //if a user send a post request to create-post url then the function in postController.create is excecuted 


module.exports = router


