const express = require('express')
const router = express.Router()
const FBAuth = require('../middleware/requireLogin')

const admin = require('firebase-admin')

router.get('/admin', FBAuth, (req, res)=>{
    admin.firestore().collection("users").get()
    .then(data=>{
        let users = []
        data.forEach(doc => {
            users.push(doc.data())
        })
        return res.json(users)
    })
    .catch(err=>{
        console.error(err)
    })
})

router.post('/admin/rankChange', FBAuth, (req, res)=>{
    const {userId, newRank} = req.body
    // console.log(userId, newRank)   
    admin.firestore().collection('users').doc(userId).update({
        rank:newRank
    })
    .then(()=>{
        // res.send({message: "document successfully edited"})
        // console.log("document successfully edited")
        admin.firestore().collection("users").get()
        .then(data=>{
            let users = []
            data.forEach(doc => {
                users.push(doc.data())
            })
            return res.json(users)
        })
        .catch(err=>{
            console.error(err)
        })
    })
    .catch(err=>{
        console.error(err)
    })
})

module.exports = router