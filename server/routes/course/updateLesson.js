const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const serviceAccount = {
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key,
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url
}

const firebaseConfig = {
    "apiKey": process.env.apiKey,
    "authDomain": process.env.authDomain,
    "databaseURL": process.env.databaseURL,
    "projectId": process.env.projectId,
    "storageBucket": process.env.storageBucket,
    "messagingSenderId": process.env.messagingSenderId,
    "appId": process.env.appId,
    "measurementId": process.env.measurementId
}

const admin = require('firebase-admin')

router.post('/updateLesson' , FBAuth, (req, res)=>{
    const {subject, chapter, lessonTitle, lesson, lessonNumber, leconId} = req.body
    // console.log(subject, " ", chapter, " ", lessonTitle, " ", lesson, " ", lessonNumber)
    // console.log(leconId)
    if(!subject || !chapter || !lessonTitle || !lesson || !lessonNumber){
        return res.status(422).json({error:"please add all the fields"})
    }
    let idToken, uid, rank
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
        //////////
        if(rank === "admin" || rank === "professor"){
            const chemin = admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapter.toLowerCase()).collection('lecons').doc(leconId)
            const lessonData = {
                chapter,
                subject,
                lessonTitle,
                lesson,
                lessonNumber
            }
            // console.log(lessonData)

            chemin.update(lessonData)
            // console.log(lessonData)
            res.send({message:`lesson updated`, createlesson:true})
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low", createlesson:false})
        }
        //////////
        
    })
})

module.exports = router