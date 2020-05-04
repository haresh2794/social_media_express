const express = require('express') //a const cannot be reassigned
const router = require('./router')
const expressLayouts = require('express-ejs-layouts')

const app = express()
//console.log(router) //What is exported is going to get stored in the variable
//router.meow() //We can use the function in the router file.
app.use(express.static('public')) //We are calling the public file
app.use(expressLayouts)
app.set('views','views') //the frst arg is a express arg and then the second is the folder
app.set('view engine','ejs') //then we need to set the view engine ,,here it is ejs



/*
//We delete this after the new router
app.get('/', function(req,res){
    res.render('index') //we are rendering the new html file for home
})
*/

app.use('/',router) //1 which url, 2. the router file. The router file contains the express Js initiated Router

app.listen(3000)