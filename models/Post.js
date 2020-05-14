const postsCollection = require('../db').db().collection('posts')
const ObjectID = require('mongodb').ObjectID
const User = require('./User')
let Post = function(data,userId,requestedPostId){
    this.data = data
    this.errors = []
    this.userId = userId
    this.requestedPostId = requestedPostId
}

Post.prototype.cleanup = function(){
    if(typeof(this.data.title) != "string"){this.data.title = ""}
    if(typeof(this.data.body) != "string"){this.data.body = ""}

    //get rid of bogus properties

    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createDate: new Date(),
        author: ObjectID(this.userId)
    }
}

Post.prototype.validate = function(){
   if (this.data.title == ""){this.errors.push("You must provide a titile")}
   if (this.data.body == ""){this.errors.push("You must provide post content")}
}

Post.prototype.create = function(){
    return new Promise((resolve,reject)=>{
        this.cleanup()
        this.validate()
        if(!this.errors.length){
            postsCollection.insertOne(this.data).then((info)=>{
                resolve(info.ops[0]._id)
            }).catch(()=>{
                this.errors.push("Please Try again")
                reject(this.errors)
            })
        }else{
            reject(this.errors)
        }
    })
}

Post.prototype.update = function(){
    return new Promise(async (resolve,reject)=>{
        try{
            let post = await Post.findSingleById(this.requestedPostId,this.userId)
            if(post.isVisitorOwner){
                //actually update db
                let status = await this.actuallyUpdate()
                resolve(status) //Status gets the resolve back
            }else{
                reject()
            }
        }catch{
            reject()
        }
    })
}

Post.prototype.actuallyUpdate = function(){
    return new Promise(async (resolve,reject)=>{
        this.cleanup() 
        this.validate()
        if (!this.errors.length){ //the db CRUD func
            await postsCollection.findOneAndUpdate({_id: new ObjectID(this.requestedPostId)},{$set: {title: this.data.title, body:this.data.body}})
            resolve("success")
        }else{
            resolve("failure")
        }

    })
}




Post.reusablePostQuery = function(uniqueOperations,visitorId){
    return new Promise(async function(resolve,reject){
        let aggOperations = uniqueOperations.concat([
            {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
            {$project: {
                title: 1,
                body: 1,
                createDate: 1,
                authorId: "$author", //this will retrun author Id of the post
                author: {$arrayElemAt: ["$authorDocument",0]} //0 for the first element at and on element obj
            }}
        ])
        let posts = await postsCollection.aggregate(aggOperations).toArray() //The aggre funtion will return an array
        //cleanup author property in each obj
        posts = posts.map(function(post){ // The map will add 
            post.isVisitorOwner = post.authorId.equals(visitorId) //This will return true or false, Test with the lab note, We have recreates the situation
            post.author = {
                username: post.author.username,
                avatar: new User(post.author,true).avatar //Obj creation with avatar set to true
            }
            return post
        })


        resolve(posts)
        
    })
}
//This is not a prototype, This is a method independnt, A functio is a obj in js
Post.findSingleById = function(id,visitorId){
    return new Promise(async function(resolve,reject){
        if(typeof(id) != "string" || !ObjectID.isValid(id)) {
            reject()
            return
        }
        let posts = await Post.reusablePostQuery([
            {$match: {_id: new ObjectID(id)}}
        ],visitorId) //Sending the visitor Id for user confirmation
        //let post = await postsCollection.findOne({_id: new ObjectID(id)}) //Previos version
        if(posts.length){ //This will view post
            console.log(posts[0])
            resolve(posts[0])
        }else{
            reject()
        }
    })
}


Post.findByAuthorId = function(authorId){
    return Post.reusablePostQuery([
        {$match: {author: authorId}},
        {$sort: {createDate: -1}}
    ])
}



module.exports = Post


