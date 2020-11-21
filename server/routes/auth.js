const express = require('express')
const router = express.Router()

const admin = require('firebase-admin')
// const serviceAccount = require('../keys/serviceAccountKey.json')
// admin.initializeApp({
//     credential:admin.credential.cert(serviceAccount),
//     databaseURL: "https://feedesmaths.firebaseio.com"
// })
const db = admin.firestore()

const firebase = require('firebase/app')
require('firebase/auth')
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

const isEmpty = (string)=>{
    if(string.trim() === ''){
        return true
    }
    else{
        return false
    }
}

const isEmail = (email)=>{
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // regEx specific expression : /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(isen.yncrea)\.fr$/
    if(email.match(regEx)){
        return true
    }
    else{return false}
}

router.post('/register', (req, res)=>{
    const {name, isenId, email, password} = req.body
    const newUser={
        name,
        isenId,
        email,
        password
    }
    //VALIDATION DATA
    let errors = {}
    if(isEmpty(newUser.email)){
        errors.email = 'Must not be empty'
    }
    else if(!isEmail(newUser.email)){
        errors.email = 'Must be a valid email adress'
    }

    if(isEmpty(newUser.password))   errors.email = 'Must not be empty'
    if(isEmpty(newUser.name))   errors.name = 'Must not be empty'
    if(isEmpty(newUser.isenId))   errors.isenId = 'Must not be empty'

    if(Object.keys(errors).length > 0){
        console.log(errors)
        return res.status(400).json({error : errors})
    }

    let token, userId, rank
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data=>{
        userId = data.user.uid
        return data.user.getIdToken()
    })
    .then(idToken=>{
        token = idToken
        rank = "student"
        const newUserDb={
            name : newUser.name,
            isenId: newUser.isenId,
            userId,
            rank
        }
        return db.collection('users').doc(`${userId}`).set(newUserDb)
    })
    .then(()=>{
        return res.status(201).json({token, user:{userId, name, email, rank}})
    })
    .catch(err=>{
        console.error(err.message)
        return res.status(500).json({error: err.message})
    })
})

router.post('/login', (req, res)=>{
    const {email, password} = req.body
    const user = {
        email,
        password
    }
    let errors ={}

    if(isEmpty(user.email))   errors.email = "Must not be empty"
    if(isEmpty(user.password))   errors.password = "Must not be empty"

    if(Object.keys(errors).length > 0)  return res.status(400).json(errors)

    let userId
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data=>{
        userId = data.user.uid
        return data.user.getIdToken()
    })
    .then(token =>{
        db.collection('users').doc(`${userId}`).get()
        .then(doc=>{
            const rank = doc.data().rank
            const name = doc.data().name
            return res.json({token, user:{userId, name, email, rank}})
        })       
    })
    .catch(err=>{
        console.error(err)
        return res.status(500).json({error: err.message})
    })


})

module.exports = router