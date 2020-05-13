//This is for the posting articles feature

exports.viewCreateScreen = function(req,res){
    res.render('create-post')
}

exports.create = function(req,res){
    res.send("Post Created")
}