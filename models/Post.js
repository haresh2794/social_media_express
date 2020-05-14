const postsCollection = require('../db').db().collection('posts')
const ObjectID = require('mongodb').ObjectID
const User = require('./User')
let Post = function(data,userId){
    this.data = data
    this.errors = []
    this.userId = userId
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
            postsCollection.insertOne(this.data).then(()=>{
                resolve()
            }).catch(()=>{
                this.errors.push("Please Try again")
                reject(this.errors)
            })
        }else{
            reject(this.errors)
        }
    })
}

Post.reusablePostQuery = function(uniqueOperations){
    return new Promise(async function(resolve,reject){
        let aggOperations = uniqueOperations.concat([
            {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
            {$project: {
                title: 1,
                body: 1,
                createDate: 1,
                author: {$arrayElemAt: ["$authorDocument",0]} //0 for the first element at and on element obj
            }}
        ])
        let posts = await postsCollection.aggregate(aggOperations).toArray()
        //cleanup author property in each obj
        posts = posts.map(function(post){
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
Post.findSingleById = function(id){
    return new Promise(async function(resolve,reject){
        if(typeof(id) != "string" || !ObjectID.isValid(id)) {
            reject()
            return
        }
        let posts = await Post.reusablePostQuery([
            {$match: {_id: new ObjectID(id)}}
        ])
        //let post = await postsCollection.findOne({_id: new ObjectID(id)}) //Previos version
        if(posts.length){
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


