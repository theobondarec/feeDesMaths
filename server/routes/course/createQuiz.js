const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')


router.post('/api/createQuiz', FBAuth, (req, res) => {
    var {subject, chapter, lessonId, question, optionA, optionB, optionC, optionD, answer, questionNumber} = req.body

    lessonId === "undifined" ? lessonId = "" : lessonId

    if(!subject || !chapter || !question || !questionNumber || answer === [] || !optionA || !optionB || !optionC || !optionD){
        return res.status(422).json({error:"please add all the fields"})
        // console.log('add all the fields')
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
                    const questionQuiz = {
                        question,
                        questionNumber,
                        optionA,
                        optionB,
                        optionC,
                        optionD,
                        answer,
                        subject,
                        chapterId
                    }
                    // console.log(questionQuiz)
                    
                    admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapterId).collection('questions').doc().set(questionQuiz)
                    // console.log("Creation quiz pour chapitre", chapter, chapterId)
                    return res.send({message:`question for the chapter ${chapter} added`, createQuestion:true})
                }
                else{
                    const questionQuiz = {
                        question,
                        questionNumber,
                        optionA,
                        optionB,
                        optionC,
                        optionD,
                        answer,
                        subject,
                        chapterId,
                        lessonId
                    }
                    // console.log(questionQuiz)

                    admin.firestore().collection('cours').doc(subject.toLowerCase()).collection('chapitres').doc(chapterId).collection('lecons').doc(lessonId).collection('questions').doc().set(questionQuiz)
                    // console.log("Creation quiz pour lecon")
                    return res.send({message:`question for the lesson n° ${lessonId} added`, createQuestion:true})
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
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router