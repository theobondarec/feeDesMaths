const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')

//// DELETE LESSON
router.delete('/api/deletepostById/:postId', FBAuth, (req, res) => {
    const postId = req.params.postId
    let idToken, uid
    let docToDel=[]
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
        if(rank === "admin" || rank === "professor"){
            // console.log(postId)
            admin.firestore().collectionGroup('lecons').where('lessonId','==',postId).get()
                .then((data) => {
                    data.forEach(doc => {
                        docToDel.push(doc.data())
                    })
                    return docToDel
                })
                .then(()=>{
                    admin.firestore().collection('cours').doc(docToDel[0].subject.toLowerCase()).collection('chapitres').doc(docToDel[0].chapterId.toLowerCase()).collection('lecons').doc(postId).delete()
                    res.json({message: `${postId} successfully delete`, allow:true})
                })
                .catch(err => {
                    console.error(err)
                })
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low"})
        }
        //////    
    })
})

router.delete('/api/deleteChapterById/:postId', FBAuth, (req, res) => {
    const postId = req.params.postId
    let idToken
    let docToDel=[]
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
    //     //////
        if(rank === "admin" || rank === "professor"){
            // console.log("chapter ID : ",postId)
            admin.firestore().collectionGroup('chapitres').where('chapterId','==',postId).get()
                .then((data) => {
                    data.forEach(doc => {
                        docToDel.push(doc.data())
                    })
                    return docToDel
                })
                .then(()=>{
                    // console.log(docToDel)
                    admin.firestore().collection('cours').doc(docToDel[0].subject.toLowerCase()).collection('chapitres').doc(docToDel[0].chapterId).delete()
                    res.json({message: `${postId} successfully delete`, allow:true})
                })
                .catch(err => {
                    console.error(err)
                })
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low"})
        }    
    })
})

module.exports = router