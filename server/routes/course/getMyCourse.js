const express = require('express')
const router = express.Router()
const FBAuth = require('../../middleware/requireLogin')

const admin = require('firebase-admin')

router.get('/api/getMyPost',FBAuth, (req, res)=>{
    ///use Token to access db and get rank
    let idToken
    let uid
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
        const uid = decodedToken.uid
        admin.firestore().collectionGroup("lecons").where('postedBy','==',uid).get()
            .then(data=>{
                let mesCours =[]
                data.forEach(doc => {
                    mesCours.push(doc.data())
                })
                // console.log(mesCours)
                return res.json({mesCours, allow:true})
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low"})
        }
        //////
    })
})


router.get('/api/getMyChapter',FBAuth, (req, res)=>{
    ///use Token to access db and get rank
    let idToken
    let uid
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
        const uid = decodedToken.uid
        admin.firestore().collectionGroup("chapitres").where('postedBy','==',uid).get()
            .then(data=>{
                let mesChapitre =[]
                data.forEach(doc => {
                    mesChapitre.push(doc.data())
                })
                // console.log(mesChapitre)
                return res.json({mesChapitre, allow:true})
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low"})
        }
        //////
    })
})

module.exports = router