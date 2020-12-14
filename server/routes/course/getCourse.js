const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')

//// GET all Chapters
router.get('/getCourse', FBAuth, (req,res)=>{
    let chapters = []
    admin.firestore().collectionGroup('chapitres').get()
    .then((data)=>{
        data.forEach(doc=>{
            if(doc.data().nom){
                // console.log(doc.data())
                chapters.push(doc.data())
            }
        })
        res.send({chapters, allow:true})
    })
    .catch(err=>{
        console.log(err)
        res.send({err, allow:false})
    })
})

router.post('/getCourseSubject', FBAuth, (req,res)=>{
    const {subject} = req.body
    let chapters = []
    admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').get()
    .then((data)=>{
        data.forEach(doc=>{
            if(doc.data().nom){
                chapters.push(doc.data())
            }
        })
            res.send({chapters, allow:true})
    })
    .catch(err=>{
        console.log(err)
        res.send({err, allow:false})
    })
})

//// GET chapters by subjects
router.get('/chapterBySubject', FBAuth, (req, res)=>{
    const {subject} = req.body

    let chapters = []
    admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').get()
    .then((data)=>{
        data.forEach(doc=>{
            if(doc.data().nom){
                chapters.push(doc.data())
            }
        })
        return chapters
    })
    .then(()=>{
        // console.log(chapters)
        res.send(chapters)
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router