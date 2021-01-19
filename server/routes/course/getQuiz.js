const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')


router.post('/api/getQuiz', FBAuth, (req, res) => {
    var {subject, chapter, lessonId} = req.body
    lessonId === "undefined" ? lessonId = "" : lessonId

    // console.log(subject, chapter, lessonId)

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
        if(rank === "student" || rank === "admin" || rank === "professor"){
            let chapterId
            admin.firestore().collectionGroup('chapitres').where('chapterTitle', '==', chapter).get()
            .then((data)=>{
                data.forEach(doc=>{
                    if(doc.data().subject === subject.toLowerCase()){
                        chapterId = doc.data().chapterId
                    }
                })
            })
            .then(()=>{
                if(!lessonId){
                    // admin.firestore().collectionGroup('questions').where('chapterId', '==', chapterId).get()
                    // admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapterId).collection('questions').orderBy('questionNumber','asc').get()
                    admin.firestore().collectionGroup('questions').where('chapterId', '==', chapterId).orderBy('questionNumber','asc').get()
                    .then(data=>{
                        // console.log(data)
                        let quiz = []
                        data.forEach(doc=>{
                            // console.log(doc.data())
                            if(!doc.data().lessonId){
                                quiz.push(doc.data())
                            }
                        })
                        res.send(quiz)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }
                else{
                    // console.log(subject, chapter, lessonId, " chapterId ", chapterId)
    
                    // admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapterId).collection('lecons').doc(lessonId).collection('questions').orderBy('questionNumber','asc').get()
                    admin.firestore().collectionGroup('questions').where('lessonId', '==', lessonId).orderBy('questionNumber','asc').get()
                    .then(data=>{
                        let quiz = []
                        data.forEach(doc=>{
                            // console.log(doc.data())
                            quiz.push(doc.data())
                        })
                        res.send(quiz)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low", createlesson:false})
        }
    })
})


router.post('/api/getQuizWChapterId', FBAuth, (req, res) => {
    var {subject, chapterId, lessonId} = req.body
    lessonId === "undefined" ? lessonId = "" : lessonId

    // console.log(subject, chapterId, lessonId)
    if(!lessonId){
        // admin.firestore().collectionGroup('questions').where('chapterId', '==', chapterId).get()
        // admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapterId).collection('questions').orderBy('questionNumber','asc').get()
        admin.firestore().collectionGroup('questions').where('chapterId', '==', chapterId).orderBy('questionNumber','asc').get()
        .then(data=>{
            // console.log(data)
            let quiz = []
            data.forEach(doc=>{
                // console.log(doc.data())
                if(!doc.data().lessonId){
                    quiz.push(doc.data())
                }
            })
            res.send(quiz)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    else{
        // console.log(subject, chapter, lessonId, " chapterId ", chapterId)

        // admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapterId).collection('lecons').doc(lessonId).collection('questions').orderBy('questionNumber','asc').get()
        admin.firestore().collectionGroup('questions').where('lessonId', '==', lessonId).orderBy('questionNumber','asc').get()
        .then(data=>{
            let quiz = []
            data.forEach(doc=>{
                // console.log(doc.data())
                quiz.push(doc.data())
            })
            res.send(quiz)
        })
        .catch(err=>{
            console.log(err)
        })
    }
})

module.exports = router