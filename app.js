const express = require('express') //a const cannot be reassigned
const expressLayouts = require('express-ejs-layouts')

const app = express()


app.use(express.static('public')) //We are calling the public file
app.use(expressLayouts)
app.set('views','views') //the frst arg is a express arg and then the second is the folder
app.set('view engine','ejs') //then we need to set the view engine ,,here it is ejs



app.get('/', function(req,res){
    res.render('index') //we are rendering the new html file for home
})

app.listen(3000)