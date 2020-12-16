const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')

router.post('/api/validateProgression', FBAuth, (req, res)=>{
    const {chapterId, lessonId} = req.body
    if(!chapterId || !lessonId){
        return res.status(422).json({error:"error with IDs"})
    }
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
        const rank = decodedToken.rank
        const uid = decodedToken.uid
        // console.log(uid, chapterId, lessonId)
        //////
        if(rank === "professor" || rank === "admin" || rank === "student"){
            admin.firestore().collection('users').doc(uid).collection('progression').doc(chapterId).set({[lessonId]:lessonId}, {merge: true})
            res.send({message:`Lecon Validée`})
        }
        else{
            return res.json({error:"error during the validation"})
        }
        //////
    })
})

module.exports = router