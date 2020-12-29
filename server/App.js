require('dotenv/config');
var path = require('path');

const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const app = express()

app.use(express.static(path.join(__dirname, 'public/build')));

const PORT = process.env.PORT || 5000


const serviceAccount = {
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key.replace(/\\n/g, '\n'),
    // "private_key": process.env.private_key,              //POUR LE DEV DEPUIS LOCALHOST
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url
}

const firebaseConfig = {
    "apiKey": process.env.apiKey,
    "authDomain": process.env.authDomain,
    "databaseURL": process.env.databaseURL,
    "projectId": process.env.projectId,
    "storageBucket": process.env.storageBucket,
    "messagingSenderId": process.env.messagingSenderId,
    "appId": process.env.appId,
    "measurementId": process.env.measurementId
}


const admin = require('firebase-admin')
admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL: "https://feedesmaths.firebaseio.com",
    storageBucket: "illustrations.appspot.com"
})

const firebase = require('firebase/app')
firebase.initializeApp(firebaseConfig)


app.use(bodyParser.json({limit: '50MB' }))
app.use(helmet())
// app.disable('x-powered-by')      /////SI NON UTILISATION DE HELMET

app.use(require('./routes/auth'))
app.use(require('./routes/admin'))
app.use(require('./routes/settings'))
app.use(require('./middleware/tokenValidity'))

//Cours
app.use(require('./routes/course/deleteCourseById'))
app.use(require('./routes/course/createCourse'))
app.use(require('./routes/course/getSpecificCourse'))
app.use(require('./routes/course/getCourse'))
app.use(require('./routes/course/getMyCourse'))
app.use(require('./routes/course/getLesson'))
app.use(require('./routes/course/modification'))
app.use(require('./routes/course/updateLesson'))
app.use(require('./routes/course/validateProgression'))
app.use(require('./routes/course/checkPrc'))
app.use(require('./routes/course/createQuiz'))
app.use(require('./routes/course/getQuiz'))
app.use(require('./routes/course/score'))
// app.use(require('./routes/course/getLessonsChap'))

// console.log(__dirname)


app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/build/index.html'))
})

app.listen(PORT, ()=>{
    console.log(`server running on : http://localhost:${PORT}`)
})