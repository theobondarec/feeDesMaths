const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000


const admin = require('firebase-admin')
const serviceAccount = require('./keys/serviceAccountKey.json')
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL: "https://feedesmaths.firebaseio.com"
})

const firebase = require('firebase/app')
const firebaseConfig = require('./keys/firebaseConfig.json')
firebase.initializeApp(firebaseConfig)


app.use(express.json())
app.use(cookieParser())         //SERT TOUJOURS ?

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/admin'))
app.use(require('./routes/settings'))



app.listen(PORT, ()=>{
    console.log(`server running on : http://localhost:${PORT}`)
})