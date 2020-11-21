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
    .then(decodedToken=>{
        req.user = decodedToken
        // console.log(decodedToken)
        return db.collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get()
    })
    .then(data=>{
        // console.log(data.docs[0].data())
        req.user.rank = data.docs[0].data().rank
        return next()
    })
    .catch(err=>{
        console.log('Error with token : ',err)
        return res.status(403).json(err)
    })
}