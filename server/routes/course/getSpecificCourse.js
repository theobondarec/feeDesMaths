const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')

//// GET CHAPTER

router.get('/getSpecificCourse/:postId', FBAuth, (req, res) => {
    const postId = req.params.postId
    let postById
    let monCours = []
    admin.firestore().collectionGroup('chapitres').where('postId', '==', postId).get()
    .then(data => {/// GET COURS
        data.forEach(doc => {
            monCours.push(doc.data())
        })
        // console.log(monCours)
        return postById = monCours[0].postedBy
    })
    .then(()=>{
        admin.firestore().collection('users').where('userId', '==', postById).get()
        .then(data => { //// GET PROFESSOR'S NAME
            let postedInfo = []
            data.forEach(doc => {
                postedInfo.push(doc.data())
            })
            const postedByName = postedInfo[0].name
            // console.log(postedByName)
            monCours.push({postedByName: postedByName})
        })
        .then(()=>{
            admin.firestore().collection('cours').doc(monCours[0].subject.toLowerCase()).collection('chapitres').doc(monCours[0].nom.toLowerCase()).collection('lecons').get()
            .then(data => { //// GET Lecons
                let lecons = []
                data.forEach(doc => {
                    lecons.push(doc.data())
                })
                // console.log(lecons[1].lesson)
                monCours.push({lecons:lecons})
                res.send(monCours)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router