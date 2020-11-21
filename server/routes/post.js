const express = require('express')
const router = express.Router()
const FBAuth = require('../middleware/requireLogin')

const admin = require('firebase-admin')
//acces à tous les posts requiert d'etre login 
router.get('/cours', FBAuth, (req, res)=>{

})

// TODO :

router.post('/createpost', FBAuth ,(req, res)=>{
    const {matiere, chapitre, lecon, description, cours, photo, pdf} = req.body
    if(!matiere || !chapitre || !lecon || !description || !cours){
        res.status(422).json({error:"please add all the fields"})
    }

})

router.get('/mypost',FBAuth, (req, res)=>{

})

router.get('/precis/:postId', FBAuth, (req,res)=>{

})

router.delete('/deletepost/:postId', FBAuth, (req, res)=>{

})

module.exports = router