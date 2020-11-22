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
    const {matiere, chapitre, lecon, description, cours, photo, pdf, postedBy} = req.body
    if(!matiere || !chapitre || !lecon || !description || !cours){
        res.status(422).json({error:"please add all the fields"})
    }
    const lesson = admin.firestore().collection('cours').doc()
    // console.log(lesson.id)
    const newLesson = {
        matiere,
        chapitre,
        lecon,
        description,
        cours,
        photo,
        pdf,
        lessonId:lesson.id,
        postedBy
    }

    lesson.set(newLesson)
    .then(()=>{
        res.json({message: `Lesson ${lesson.id} created successfully`})
    })
    .catch(err=>{
        res.status(500).json({error: 'something went wrong'})
        console.log(err)
    })
})

router.get('/mypost/:userId',FBAuth, (req, res)=>{
    const userId = req.params.userId
    // console.log(userId)
    admin.firestore().collection('cours').where('postedBy', '==', userId).get()
    .then(data=>{
        let mesCours =[]
        data.forEach(doc => {
            mesCours.push(doc.data())
        })
        // console.log(mesCours)
        return res.json(mesCours)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/precis/:postId', FBAuth, (req,res)=>{
    const postId = req.params.postId
    let postById
    let postedByName
    // console.log(postId)
    admin.firestore().collection('cours').where('lessonId', '==', postId).get()
    .then(data=>{
        let mesCours =[]
        data.forEach(doc => {
            mesCours.push(doc.data())
        })
        postById = mesCours[0].postedBy
        // console.log(postById)
        admin.firestore().collection('users').where('userId', '==', postById).get()
        .then(data=>{
            let postedInfo =[]
            data.forEach(doc => {
                postedInfo.push(doc.data())
            })
            postedByName = postedInfo[0].name
            // console.log(postedByName)
            mesCours.push({postedByName:postedByName})
            // console.log(mesCours)
            return res.json(mesCours)  
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.delete('/deletepost/:postId', FBAuth, (req, res)=>{
    const postId = req.params.postId
    // console.log(postId)
    admin.firestore().collection('cours').doc(postId).delete()
    .then(()=>{
        res.json({message: "document delete successfully "})
    })
    .catch(err=>{
        console.error(err)
    })
})

module.exports = router