const express = require('express')
const router = express.Router()

const admin = require('firebase-admin')
const { decode } = require('jsonwebtoken')

router.get('/api/tokenIsOk', (req,res)=>{
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized', tokenOk: false})
    }
    admin.auth().verifyIdToken(idToken)
    .then((decodedToken)=>{
        // console.log("true",decodedToken)
        res.json({tokenOk: true})
    })
    .catch(err=>{
        console.error(err)
        res.json({tokenOk:false})
    })
})

router.get('/api/checkRank', (req,res)=>{
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized', tokenOk: false})
    }
    admin.auth().verifyIdToken(idToken)
    .then((decodedToken)=>{
        // console.log(decodedToken.rank)
        res.json(decodedToken.rank)
    })
    .catch(err=>{
        console.error(err)
    })
})

module.exports = router