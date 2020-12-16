// const express = require('express')
// const router = express.Router()
// const FBAuth = require('../../middleware/requireLogin')

// const admin = require('firebase-admin')

// //// GET CHAPTER

// router.get('/api/getAllLessons/:postId', FBAuth, (req, res) => {
//     const postId = req.params.postId
//     let postById
//     let monCours = []

//     admin.firestore().collectionGroup('chapitres').where('chapterId', '==', postId).get()
//     .then(data => {/// GET COURS
//         data.forEach(doc => {
//             // console.log(doc.data())
//             monCours.push(doc.data())
//         })
//         // return postById = monCours[0].postedBy
//     })
//     .then(()=>{
//         // console.log(monCours[0])
//         admin.firestore().collection('cours').doc(monCours[0].subject.toLowerCase()).collection('chapitres').doc(monCours[0].chapterId).collection('lecons').orderBy('lessonNumber', 'asc').get()
//         .then(data => { //// GET Lecons
//             let lecons = []
//             data.forEach(doc => {
//                 lecons.push(doc.data())
//             })
//             // monCours.push({lecons})
//             // res.send(monCours)
//             res.send(lecons)
//         })
//     })
//     .catch(err => {
//         console.log(err)
//     })
// })

// module.exports = router