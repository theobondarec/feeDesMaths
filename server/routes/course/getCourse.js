const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')

//// GET all Chapters
router.get('/api/getCourse', FBAuth, (req,res)=>{
    let chapters = []
    admin.firestore().collectionGroup('chapitres').orderBy('chapterNumber','asc').get()
    .then((data)=>{
        data.forEach(doc=>{
            // console.log(doc.data())
            if(doc.data().chapterTitle){
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

router.post('/api/getCourseSubject', FBAuth, (req,res)=>{
    const {subject} = req.body
    let chapters = []
    admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').orderBy('chapterNumber','asc').get()
    .then((data)=>{
        data.forEach(doc=>{
            if(doc.data().chapterTitle){
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
router.get('/api/chapterBySubject', FBAuth, (req, res)=>{
    const {subject} = req.body
    let chapters = []
    admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').orderBy('chapterNumber','asc').get()
    .then((data)=>{
        data.forEach(doc=>{
            if(doc.data().chapterTitle){
                chapters.push(doc.data())
            }
        })
        res.json(chapters)
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router