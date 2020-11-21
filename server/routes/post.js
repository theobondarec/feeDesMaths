const express = require('express')
const router = express.Router()
const FBAuth = require('../middleware/requireLogin')

const admin = require('firebase-admin')
//acces aux posts, cree un post == LOGIN
router.get('/cours', FBAuth ,(req, res)=>{
    admin.firestore().collection("cours").get()
    .then(data=>{
        let cours = []
        data.forEach(doc => {
            cours.push(doc.data())
        })
        return res.json(cours)
    })
    .catch(err=>{
        console.error(err)
    })
})

router.post('/createpost', FBAuth ,(req, res)=>{
    const {matiere, chapitre, lecon, description, cours, photo, pdf} = req.body
    if(!matiere || !chapitre || !lecon || !description || !cours){
        res.status(422).json({error:"please add all the fields"})
    }
    const newLesson = {
        matiere,
        chapitre,
        lecon,
        description,
        cours,
        photo,
        pdf
    }

    admin.firestore().collection("cours").add(newLesson)
    .then(doc=>{
        res.json({message: `Lesson ${doc.id} created successfully`})
    })
    .catch(err=>{
        res.status(500).json({error: 'something went wrong'})
        console.log(err)
    })
})

// TODO :
router.get('/mypost',FBAuth, (req, res)=>{

})

router.get('/precis/:postId', FBAuth, (req,res)=>{

})

router.delete('/deletepost/:postId', FBAuth, (req, res)=>{

})

module.exports = router