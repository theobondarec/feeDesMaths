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
        })
        return res.send(monCours)
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router