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

router.post('/createSubject', FBAuth, (req, res)=>{
    const {subject} = req.body
    if(!subject){
        return res.status(422).json({error:"please add all the fields"})
    }
    let idToken, uid
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
        //////
        if(rank === "professor" || rank === "admin"){
            admin.firestore().collection('cours').doc(subject.toLowerCase()).set({nom:subject})
            res.send({message:`subject added`, createSubject:true})
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low"})
        }
        //////
    })
})

router.post('/createChapter', FBAuth, (req,res)=>{
    const {subject, chapter, chapterIllustration, chapterDesc, chapNumber} = req.body
    // console.log(req.body)
    if(!subject || !chapter || !chapterIllustration || !chapterDesc || !chapNumber){
        return res.status(422).json({error:"please add all the fields"})
    }
    let idToken, uid
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
        ///////
        if(rank === "professor" || rank === "admin"){
            const uid = decodedToken.uid
            const fireStore = admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapter.toLowerCase())
            const ID = Math.random().toString(36).substr(2, 13) + Math.random().toString(36).substr(2, 13) + Math.random().toString(36).substr(2, 13)
            const chapter_details = {
                description:chapterDesc,
                illustration:chapterIllustration,
                nom:chapter,
                postedBy:uid,
                postId:ID,
                subject,
                chapNumber
            }
            fireStore.set(chapter_details)
            res.send({message:`chapter added`, createChapter:true})
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low"})
        }
        //////
    })
})

router.post('/createCourse' , FBAuth, (req, res)=>{
    const {subject, chapter, lessonTitle, lesson, lessonNumber} = req.body
    // console.log(lesson)
    if(!subject || !chapter || !lessonTitle || !lesson || !lessonNumber){
        return res.status(422).json({error:"please add all the fields"})
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
        /////////
        if(rank === "admin" || rank === "professor"){
            const chemin = admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapter.toLowerCase()).collection('lecons').doc()
            const lessonData = {
                chapter,
                subject,
                lessonTitle,
                lesson,
                postedBy:uid,
                postId:chemin.id,
                lessonNumber
            }
            chemin.set(lessonData)
            // console.log(lessonData)
            res.send({message:`lesson added`, createlesson:true})
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low", createlesson:false})
        }
        /////////
    })
})

//// Return les chapitres et les matieres pour les dropdown ajout une lesson
router.get('/subjects', FBAuth, (req,res)=>{
    let subjects = []
    admin.firestore().collection('cours').get()
    .then((data)=>{
        data.forEach(doc=>{
            if(doc.data().nom){
                // console.log(doc.data().nom)
                subjects.push(doc.data().nom)
            }
        })
        res.send({subjects, allow:true})
    })
    .catch(err=>{
        res.send({allow:false})
        console.error(err)
    })
})

router.get('/chapters', FBAuth, (req,res)=>{
    // const {subject} = req.body
    let chapters = []
    admin.firestore().collectionGroup('chapitres').get()
    .then((data)=>{
        data.forEach(doc=>{
            // chapters.push(doc.data())
            if(doc.data().nom){
                // console.log(doc.data().nom)
                chapters.push(doc.data().nom)
            }
        })
        res.send({chapters, allow:true})
    })
    .catch(err=>{
        res.send({allow:false})
        console.error(err)
    })
})

router.post('/chaptersPrecis', FBAuth, (req,res)=>{
    const {subject} = req.body
    let chapters = []
    admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').get()
    .then((data)=>{
        data.forEach(doc=>{
            if(doc.data().nom){
                // console.log(doc.data().nom)
                chapters.push(doc.data().nom)
            }
        })
        res.send({chapters, allow:true})
    })
    .catch(err=>{
        res.send({allow:false})
        console.error(err)
    })
})

module.exports = router