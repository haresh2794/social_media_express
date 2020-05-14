//This is for the posting articles feature
const Post = require('../models/Post')

exports.viewCreateScreen = function(req,res){
    res.render('create-post')
}

exports.create = function(req,res){
    let post = new Post(req.body,req.session.user._id) //Using the blue print post is created
    post.create().then(function(){
        res.send("New post created")
    }).catch(function(err){
        res.send(err)
    })
}

exports.viewSingle = async function(req,res){
    try{
        let post = await Post.findSingleById(req.params.id) //create a post obj not with the blue print but just a call method inside
        res.render('single-post', {post: post}) //render after the return is received
    }catch{
        res.render('404')
    }
    //res.render('single-post')
}
