const express = require('express')
const { auth } = require('firebase-admin')
const router = express.Router()

const admin = require('firebase-admin')
const db = admin.firestore()

const firebase = require('firebase/app')
require('firebase/auth')

const isEmpty = (string) => {
    if (string.trim() === '') {
        return true
    } else {
        return false
    }
}

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // regEx specific expression : /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(isen.yncrea)\.fr$/
    if (email.match(regEx)) {
        return true
    } else {
        return false
    }
}

router.post('/api/register', (req, res) => {
    const {name, email, password} = req.body
    const newUser = {
        name,
        email,
        password
    }
    //VALIDATION DATA
    let errors = {}
    if (isEmpty(newUser.email)) {
        errors.email = 'Email must not be empty'
    } else if (!isEmail(newUser.email)) {
        errors.email = 'Must be a valid email adress'
    }

    if (isEmpty(newUser.password)) errors.password = 'Password must not be empty'
    if (isEmpty(newUser.name)) errors.name = 'Name must not be empty'

    if (Object.keys(errors).length > 0) {
        // console.log(errors)
        return res.status(400).json({error: errors})
    }

    let token, userId, rank
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(data => {
            // console.log(data)
            userId = data.user.uid
            return data.user.getIdToken()
        })
        .then(idToken => {
            token = idToken
            rank = "student"
            const newUserDb = {
                name: newUser.name,
                email: newUser.email,
                userId,
                rank
            }
            return db.collection('users').doc(`${userId}`).set(newUserDb)
        })
        .then(() => {
            return res.status(201).json({token, user: {rank}})
        })
        .catch(err => {
            console.error(err.message)
            return res.status(500).json({error: err.message})
        })
})

router.post('/api/login', (req, res) => {
    let errors = {}
    const {email, password} = req.body
    const user = {
        email,
        password
    }
    if (isEmpty(user.email)) {
        errors.email = 'Email must not be empty'
    } else if (!isEmail(user.email)) {
        errors.email = 'Must be a valid email adress'
    }

    if (isEmpty(user.password)) errors.password = 'Password must not be empty'

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({error: errors})
    }
    admin.auth().getUserByEmail(user.email)
    .then((userRecord)=>{
        const userId = userRecord.uid
        // console.log(userId)
        db.collection('users').doc(`${userId}`).get()
        .then(doc => {
            const rank = doc.data().rank
            additionalClaims= {
                rank
            }
            // console.log(additionalClaims)
            admin.auth().setCustomUserClaims(userId, additionalClaims)
            .then(()=>{
                firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(data => {
                    // const userId = data.user.uid
                    data.user.getIdToken().then((token)=>{
                        return res.json({token, user: {rank}})
                    })
                })
                .catch(err=>{
                    console.error(err)
                    return res.status(500).json({error: err.message})
                })                
            })
            .catch(err=>{
                console.error(err)
                return res.status(500).json({error: err.message})
            })
        })
        .catch(err=>{
            console.error(err)
            return res.status(500).json({error: err.message})
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error: err.message})
    })




    // let userId
    // firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    //     .then(data => {
    //         userId = data.user.uid
    //         return data.user.getIdToken()
    //     })
    //     .then(token => {
    //         db.collection('users').doc(`${userId}`).get()
    //             .then(doc => {
    //                 const rank = doc.data().rank
    //                 return res.json({token, user: {rank}})
    //             })
    //     })
    //     .catch(err => {
    //         console.error(err)
    //         return res.status(500).json({error: err.message})
    //     })

    // CREATION TOKEN 

    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
})

module.exports = router