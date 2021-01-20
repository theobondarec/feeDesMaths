const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')

router.get('/api/getQuizScoreForChapter/:chapterTitle', FBAuth, (req, res) => {
    const chapterTitle = req.params.chapterTitle
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'})
    }


    admin.auth().verifyIdToken(idToken)
    .then(verifyIdToken=>{
        const uid = verifyIdToken.uid
        let note = []
        admin.firestore().collection('users').doc(uid).collection('notes').where('chapterTitle','==',chapterTitle).get()
        .then((data)=>{
            data.forEach(item=>{
                if(item.data().lessonTitle === ''){
                    note.push(item.data().note)
                }
            })
            res.send(note)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/api/getQuizScoreForLesson/:lessonTitle', FBAuth, (req, res) => {
    const lessonTitle = req.params.lessonTitle
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'})
    }


    admin.auth().verifyIdToken(idToken)
    .then(verifyIdToken=>{
        const uid = verifyIdToken.uid
        let note = []
        admin.firestore().collection('users').doc(uid).collection('notes').where('lessonTitle','==',lessonTitle).get()
        .then((data)=>{
            data.forEach(item=>{
                note.push(item.data().note)
            })
            res.send(note)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/api/postQuizzScore', FBAuth, (req, res)=>{
    const {subject, chapterTitle, lessonTitle, note} = req.body
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'})
    }

    admin.auth().verifyIdToken(idToken)
    .then(decodedToken =>{
        const uid = decodedToken.uid
        const data={
            subject:subject.toLowerCase(),
            chapterTitle:chapterTitle.toLowerCase(),
            lessonTitle:lessonTitle.toLowerCase(),
            note:parseInt(note)
        }

        // console.log(data)

        admin.firestore().collection('users').doc(uid).collection('notes').doc().set(data)

        return res.send({message:`score posted`})
    })

})

module.exports = router