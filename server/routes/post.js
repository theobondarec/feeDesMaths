const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

//acces à tous les posts requiert d'etre login 
router.get('/cours', requireLogin, (req, res)=>{
    Post.find()
    .populate("postedBy", "_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

//creation post schema
router.post('/createpost', requireLogin ,(req, res)=>{
    const {matiere, chapitre, lecon, description, cours, photo, pdf} = req.body
    if(!matiere || !chapitre || !lecon || !description || !cours){
        res.status(422).json({error:"please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        matiere,
        chapitre,
        lecon,
        description,
        cours,
        photo,
        pdf,
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

router.get('/precis/:postId', requireLogin, (req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id name")
    .then(post=>{
        // console.log(posts)
        res.json(post)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.delete('/deletepost/:postId', requireLogin, (req, res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
                .then(result=>{
                    res.json(result)
                }).catch(err=>{
                    console.log(err)
                })
        }
    })
})

module.exports = router