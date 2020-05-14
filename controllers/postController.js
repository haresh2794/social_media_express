//This is for the posting articles feature
const Post = require('../models/Post')

exports.viewCreateScreen = function(req,res){
    res.render('create-post')
    }

exports.create = function(req,res){
    let post = new Post(req.body,req.session.user._id) //Using the blue print post is created
    post.create().then(function(newId){
        req.flash("success","New Post Created")
        req.session.save(()=>{
            res.redirect(`/post/${newId}`)
        })
       
    }).catch(function(err){
        err.forEach(err => req.flash("errors",err))
        req.session.save(()=> res.redirect("/create-post"))
    })
}   

exports.viewSingle = async function(req,res){
    try{
        let post = await Post.findSingleById(req.params.id,req.visitorId) //create a post obj not with the blue print but just a call method inside
        res.render('single-post', {post: post}) //render after the return is received
    }catch{
        res.render('404')
    }
    //res.render('single-post')
}

exports.viewEditScreen = async function(req,res){
    try{
        let post = await Post.findSingleById(req.params.id,req.visitorId)
        if(post.authorId==req.visitorId){
            res.render('edit-post', {post:post})
        }else{
            req.flash("errors","You do not have permission")
            req.session.save(()=>{
                res.redirect('/')
            })
        }
    }catch{
        res.render('404')
    }
}

exports.edit = function(req,res){
    let post = new Post(req.body,req.visitorId,req.params.id)
    post.update().then((status)=>{
        //the post was sucessfully up in the db
        //of user persmissio, but validation errpr
        if (status=="success"){ //If the edit is sucessfull it will return this success through promise
            req.flash("success","Post updated sucessfully")
            req.session.save(function(){
                res.redirect(`/post/${req.params.id}`)
            })
        }else{
            post.errors.forEach(function(error){
                req.flash("errors",error)
            })
            req.session.save(function(){
                res.redirect(`/post/${req.params.id}`)
            })
        }
    }).catch(()=>{
        //if the post with the req id doesnot exist
        //if the current visitor is not the owner
        req.flash("errors","You do not have permission")
        req.session.save(function(){
            res.redirect('/')
        })
    })
}