const express = require('express')
const router = express.Router()
const FBAuth = require('../middleware/requireLogin')

const admin = require('firebase-admin')

router.get('/api/admin', FBAuth, (req, res)=>{
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

        ////////
        if(rank == "admin"){
            // console.log("OK you can acess to this function")
            admin.firestore().collection("users").get()
            .then(data=>{
                let users = []
                data.forEach(doc => {
                    users.push(doc.data())
                })
                return res.json({users, allow:true})
            })
            .catch(err=>{
                console.error(err)
            })
        }
        else{
            // console.log("you're not allow to access at this function, you're rank is too low")
            return res.json({error:"you're not allow to access at this function, you're rank is too low"})
        }
        ////////
    })
})

router.post('/api/admin/rankChange', FBAuth, (req, res)=>{
    ///use Token to access db and get rank
    let idToken, uid
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
            if(rank === "admin"){
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
                        return res.json({users, allow:true, message:"user's rank successfully changed"})
                    })
                    .catch(err=>{
                        console.error(err)
                        return res.status(500).json({error: err})        
                    })
                })
                .catch(err=>{
                    console.error(err)
                    return res.status(500).json({error: err})
                })
            }
            else{
                return res.json({error:"you're not allow to access at this function, you're rank is too low"})
            }
            //////

    })
})


router.delete('/api/delUserFirestore/:userId', FBAuth, (req, res) => {
    const userId = req.params.userId

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
    //     //////
        if(rank === "admin"){
            // console.log(userId)
            admin.auth().deleteUser(userId)
            .then(()=>{
                // console.log("user delete from auth successfully")
                admin.firestore().collection('users').doc(userId).delete()
                .then(()=>{
                    res.json({message: `used successfully delete`, allow:true})
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else{
            return res.json({error:"you're not allow to access at this function, you're rank is too low"})
        }    
    })
})

module.exports = router