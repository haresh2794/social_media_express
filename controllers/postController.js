//This is for the posting articles feature
const Post = require('../models/Post')

exports.viewCreateScreen = function(req,res){
    res.render('create-post')
}

exports.create = function(req,res){
    let post = new Post(req.body) //Using the blue print post is created
    post.create().then(function(){
        res.send("New post created")
    }).catch(function(err){
        res.send(err)
    })
}