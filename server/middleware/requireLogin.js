// User data come from here
const admin = require('firebase-admin')
const db = admin.firestore()

module.exports=(req, res, next)=>{
    let idToken
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1]
    }
    else{
        console.error('No token found')
        return res.status(403).json({error: 'Unauthorized'})
    }

    admin.auth().verifyIdToken(idToken)
    .then((decrypted)=>{
        // console.log(decrypted)
        return next()
    })
    .catch(err=>{
        console.log('Error with token : ',err.code)
        return res.status(403).json(err)
    })
}