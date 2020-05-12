const express = require('express') //a const cannot be reassigned
const session = require('express-session') //Importing Express Sessions
const MongoStore = require('connect-mongo')(session)
const router = require('./router')
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const app = express()

let sessionOptions = session({ //Setting up the configurations for session 
    secret: "JavaScript is so cool",
    store: new MongoStore({client: require('./db')}), //creating the storage location, deafualt is server memory
    resave: false,
    saveUninitialized: false, 
    cookie: {maxAge: 1000*60*60*24, httpOnly:true} //How long the cook should stay
})

app.use(sessionOptions) //Using the session function
app.use(flash()) //Leverage the flash
//console.log(router) //What is exported is going to get stored in the variable
//router.meow() //We can use the function in the router file.

//Start accptiing HTMl and json text
app.use(express.urlencoded({extended:false})) //The blahh blah code to the body access, accepts traditional HTML
app.use(express.json()) //and accepts json data //blah blah 2


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

module.exports = app //Instead of the below line here we call it after establishing the connection with DB
//app.listen(3000)