const mongodb = require('mongodb') //importing the mongodb package


//Connection String and connecting to the DB
connectionString = 'mongodb+srv://todoapp:passwordlms@cluster0-i1fmx.mongodb.net/socialApp?retryWrites=true&w=majority'
mongodb.connect(connectionString,{ useNewUrlParser: true, useUnifiedTopology: true },function(err,client){
    module.exports = client.db() //this will be exported to other files
    const app = require('./app') //What we have don is exported the app variable from app.js and imported it here.
    app.listen(3000) // Then called it from here.
})