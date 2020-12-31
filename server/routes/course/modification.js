const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')
const admin = require('firebase-admin')
//// GET Lesson

router.get('/api/modification/:postId', FBAuth, (req, res) => {
    const postId = req.params.postId
    // res.send(postId)
    // console.log(postId)

    let postById
    let monCours = []
    admin.firestore().collectionGroup('lecons').where('lessonId', '==', postId).get()
    .then(data => {/// GET lecon
        data.forEach(doc => {
            monCours.push(doc.data())
        })
        return res.send(monCours)
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/api/chapterModification/:postId', FBAuth, (req, res) => {
    const postId = req.params.postId
    // res.send(postId)
    // console.log(postId)

    // let postById
    let monChapitre = []
    admin.firestore().collectionGroup('chapitres').where('chapterId', '==', postId).get()
    .then(data => {/// GET chapitre
        data.forEach(doc => {
            monChapitre.push(doc.data())
        })
        return res.send(monChapitre)
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router