const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

//acces à tous les posts requiert d'etre login
router.get('/allpost', requireLogin, (req, res)=>{
    Post.find()
    .populate("postedBy", "_id name")
    .then(posts=>{
        res.json({posts})
        res.send(posts)
    })
    .catch(err=>{
        console.log(err)
    })
})

//creation post schema
router.post('/createpost', requireLogin ,(req, res)=>{
    const {title, body} = req.body
    if(!title || !body){
        res.status(422).json({error:"please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

//get lessons i've posted
router.get('/mypost',requireLogin, (req, res)=>{
    Post.find({postedBy:req.user._id})
    .populate("potedBy", "_id name")
    .then(mypost =>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router