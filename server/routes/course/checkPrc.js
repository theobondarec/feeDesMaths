const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')


router.get('/api/checkProgression/:postId', FBAuth, (req, res) => {
    const postId = req.params.postId
    // console.log(postId)
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'})
    }
    admin.firestore().collectionGroup('lecons').where('chapterId', '==', postId).get()
    .then((data)=>{
        const totalChapterSize = data.size
        admin.auth().verifyIdToken(idToken)
        .then(verifyIdToken=>{
            const uid = verifyIdToken.uid
            let chapterDone
            admin.firestore().collection('users').doc(uid).collection('progression').doc(postId).get()
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
                res.send({chapterProgression})

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

module.exports = router