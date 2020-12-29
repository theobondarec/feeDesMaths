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

router.post('/api/globalProgression', FBAuth, (req,res)=>{
    const {subject, lessonId, chapterTitle, chapterId} = req.body
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
        const uid = decodedToken.uid
        ////// CALCUL %
        admin.firestore().collectionGroup('lecons').where('chapterId', '==', chapterId).get()
        .then((data)=>{
            const totalChapterSize = data.size
            admin.auth().verifyIdToken(idToken)
            .then(verifyIdToken=>{
                const uid = verifyIdToken.uid
                let chapterDone
                admin.firestore().collection('users').doc(uid).collection('progression').doc(chapterId).get()
                .then(data=>{
                    // console.log(data.data())
                    if(data.data() != undefined){
                        // console.log(data.data())
                        chapterDone = Object.keys(data.data()).length
                    }
                    else if(data.data() === undefined){
                        // console.log("undifined",data.data())
                        chapterDone = 0
                    }
                    const chapterProgression = (chapterDone/totalChapterSize)*100
                    // admin.firestore().collection('users').doc(uid).collection('progressionG').doc(chapterId).set({[chapterTitle]:chapterProgression}, {merge: true})
                    admin.firestore().collection('users').doc(uid).collection('progressionG').doc(chapterId).set({chapterTitle, progression:chapterProgression, subject}, {merge: true})
                    // console.log('push successfully')
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{
                console.log(err)
            })
        })
        .catch(err=>{
            console.error(err)
        })
    })
})


router.get('/api/getGlobalProgression', FBAuth, (req,res)=>{
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'})
    }
    let uid 
    admin.auth().verifyIdToken(idToken)
        .then(verifyIdToken=>{
            uid = verifyIdToken.uid
            let progression = []
            let chapterName = []
            admin.firestore().collection('users').doc(uid).collection('progressionG').get()
            .then(data=>{
                data.forEach(doc=>{
                    chapterName.push(doc.data().subject)
                    progression.push(doc.data())
                })
            })
            .then(()=>{
                chapterName = new Set(chapterName)
                chapterName = [...chapterName]
                // console.log(chapterName)
                res.json({progression, chapterName})
            })
        })
        .catch(err=>{
            console.log(err)
        })
})

router.get('/api/getScores', FBAuth, (req,res)=>{
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'})
    }
    let uid 
    admin.auth().verifyIdToken(idToken)
    .then(verifyIdToken=>{
        uid = verifyIdToken.uid
        let notes = []
        let chapterName = []
        admin.firestore().collection('users').doc(uid).collection('notes').get()
        .then(data=>{
            data.forEach(doc=>{
                // console.log(doc.data())
                chapterName.push(doc.data().subject)
                notes.push(doc.data())
            })
        })
        .then(()=>{
            chapterName = new Set(chapterName)
            chapterName = [...chapterName]
            notes = notes.reverse()
            // console.log(notes)
            res.json({notes, chapterName})
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router