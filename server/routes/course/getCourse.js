const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')

//// GET all Chapters
router.get('/api/getCourse', FBAuth, (req,res)=>{
    let chapters = []
    let lessons = []
    let count = 0
    admin.firestore().collectionGroup('chapitres').orderBy('chapterNumber','asc').get()
    .then((data)=>{
        data.forEach(doc=>{
            // console.log(doc.data())
            if(doc.data().chapterTitle){
                // console.log(doc.data())
                chapters.push(doc.data())
            }
        })
        // chapters.map(item=>{
        //     // console.log(item.chapterTitle)
        //     lessons[item.chapterTitle] = []
        //     admin.firestore().collection('cours').doc(item.subject.toLowerCase()).collection('chapitres').doc(item.chapterId).collection('lecons').orderBy('lessonNumber', 'asc').get()
        //     .then(resultat=>{
        //         resultat.forEach(item=>{
        //             // console.log(item.data().chapter)
        //             count += 1
        //             console.log(item.data())
        //             lessons[item.data().chapter].unshift(item.data())


        //             SEND 
        //             console.log(count, resultat.size)
        //         })
        //         console.log(lessons)
        //         // res.send({chapters, lessons ,allow:true})
        //     })
        // })
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