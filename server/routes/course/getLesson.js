const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')


//// GET CHAPTER
router.get('/api/lesson/:postId', FBAuth, (req, res) => {
    const postId = req.params.postId

    let postById
    let monCours = []
    admin.firestore().collectionGroup('lecons').where('lessonId', '==', postId).get()
    .then(data => {/// GET lecon
        data.forEach(doc => {
            monCours.push(doc.data())
            // console.log(doc.data())
        })
        return res.send(monCours)
    })
    .catch(err => {
        console.log(err)
    })
})


router.get('/api/lesson', FBAuth, (req,res)=>{
    let lessons = []
    admin.firestore().collectionGroup('lecons').orderBy('lessonNumber', 'asc').get()
    .then((data)=>{
        data.forEach(element => {
            // console.log(element.data())
            lessons.push(element.data())
        })
        res.send({lessons, allow:true})
    })
    .catch(err=>{
        console.log(err)
        res.send({err, allow:false})
    })
})


// router.post('/api/lessonWithoutSubject', FBAuth, (req,res)=>{
//     const {chapter} = req.body
//     // console.log(chapter)
//     let lessons = []
//     admin.firestore().collectionGroup('lecons').where('chapter','==',chapter).get()
//     .then((data)=>{
//         data.forEach(doc=>{
//             // console.log(doc.data())
//             lessons.push(doc.data())
//         })
//         res.send({lessons, allow:true})
//     })
//     .catch(err=>{
//         console.log(err)
//         res.send({err, allow:false})
//     })
// })

// router.post('/api/lessonWithoutChapter', FBAuth, (req,res)=>{
//     const {subject} = req.body
//     console.log(subject)
//     let lessons = []
//     admin.firestore().collectionGroup('lecons').where('subject','==',subject).get()
//     .then((data)=>{
//         data.forEach(doc=>{
//             // console.log(doc.data())
//             lessons.push(doc.data())
//         })
//         res.send({lessons, allow:true})
//     })
//     .catch(err=>{
//         console.log(err)
//         res.send({err, allow:false})
//     })
// })

router.post('/api/lessonWithEverything', FBAuth, (req,res)=>{
    const {subject, chapter} = req.body
    // console.log("subject/chapter : ",subject, chapter)
    let lessons = []

    let chapterId
    admin.firestore().collectionGroup('chapitres').where('chapterTitle', '==', chapter).get()
    .then((data)=>{
        data.forEach(doc=>{
            // console.log(doc.data().chapterId)
            chapterId = doc.data().chapterId
        })
    })
    .then(()=>{
        //// Recuperer le chapterID
        // console.log(chapterId)
        admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapterId).collection('lecons').get()
        .then((data)=>{
            data.forEach(doc=>{
                // console.log(doc.data())
                lessons.push(doc.data())
            })
            res.send({lessons, allow:true})
        })
        .catch(err=>{
            console.log(err)
            res.send({err, allow:false})
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router