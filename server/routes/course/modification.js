const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')
const admin = require('firebase-admin')
//// GET Lesson

router.get('/modification/:postId', FBAuth, (req, res) => {
    const postId = req.params.postId
    // res.send(postId)
    // console.log(postId)

    let postById
    let monCours = []
    admin.firestore().collectionGroup('lecons').where('postId', '==', postId).get()
    .then(data => {/// GET lecon
        data.forEach(doc => {
            // console.log(doc.data())
            monCours.push(doc.data())
        })
        // console.log(monCours)
        return res.send(monCours)
        // return postById = monCours[0].postedBy
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router