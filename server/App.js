require('dotenv/config');
var path = require('path');



const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static(path.join(__dirname, 'public/build')));

const PORT = process.env.PORT || 5000


const serviceAccount = {
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key.replace(/\\n/g, '\n'),
    // "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDx0lZtwR7YYqOs\njvsssjUt8ghR7derheEywwu4tHj08hYafOkwW7LRRB8Q3zqVQgpLCZRL4nRwo9za\nuVnzoLZaWjoM9vptQ19Wc1PtArn02B6aNnNBeWuIGGGgc/ViTgcsVB5xHw7tMN6j\nFk4jLSP0SSyfA/M02V8UPZlDAxXpK9vSfTn6jzHqCuCO9nGUblLhwxrKPjK+jLBl\nqckxORdrGIZ3jNZPmD26cBLUHaiRbVeuLkvOrSqgp/uGMi2PG1BlfKai3cVaNvgo\n/XkTFcKfE5UlYQWm9NjqFVC6V0tAYY4GZ/Jm6VnW67BdN5lKt78KvagG9lhA4s/x\nP6IyV4HpAgMBAAECggEAD+YrSE9NlL7Egd6LOVy0piMPBLr5ZnW4kRa1lTTpbHpj\ntWVfzA4FX2CmFb0FjCVxyY31TflzPCor5cYQudXH04Ax56MP40HuGWAfBRrcKNLS\nTUOV95iw9xtaRNtG54oXiuSzdS7Mc5AWXTzk0YeA4Ql0GXbgJUoC6DDmHBuuc7xt\nnwWSn3O4W/OJu4gCd4qD+Gxa/LDuumuzpGkfI9FPD3kgY7l5gFV9VKGQMHGKW/DD\nNi6QUMs/fVAbJyI9oGl3cFOdxWQJp5v1SGeKEB/BuSwkDgvxoeRPA2iO09P96h4a\nZKIJiJVuUqZkN73tJrjA3fcu5KgnGv2u+289UZwpgQKBgQD+22g/dNoAZKrKnNgH\ndOSQrE/BQ/rvNgs0LZn/8CuFCEtETyBZti0AdZ2t7jT43Sj6G2K5oUmIXtQOmbMx\nbe9+ADaaWJ/Qzj/QITnzO49rL+XGfJAnxnMtZHmxRQap0u3+MRnTFZCk9wp5pi+h\n0T0y/pnhyRb+3QKR0lkDtVG0gQKBgQDy5/cBAvkXMPEXu0CGU37ERQMYdxwnLhWi\nJaSeR8buMsGAwfAynNm6m09ksnlWU7UdD/uVbHlLhscK4CjSVr2bK1nPxzg6CRah\nBi14vyOqtlNk8GSTxRsqzqTECmu3MC51E4V4ReO1AsWOySSvG+j5bV9SP66KkUlw\n6ylxXcP5aQKBgQDzCgV2Tlb+/QEqyzvwkHbPyKMeKVgJ+z3f+oTb4AuAiBJPCC5P\nnz13LLK8BWga072aFbemUrsvA0+yxLxwLOiw/j8UHeP6WlXcg3MiE/CHRVwYVv2a\nENQRu7mZZbwfA3nWaLi55dzUlIo2zFasOD/me4oAGaaGUfl7Wl9s++L5AQKBgDA2\neoBo5qgDvtbHA/elevPZ/tNMUPo123Vjo1kHRiThTicQV2y0VUMEsK17/zlzQ++Q\nzI7MCQdEqR0vgOq+7MNvx1PGZxKd2y/62euthJbNuZ+/Vzc9WDcW7P08VET3+0Ch\nr0xAEwJKmovMwMtA7u0TGGhq22oFjF4tTvyBb/SBAoGAYqL9jNihybwpKGsE+bFE\n0GUTkWalqq2pH9ziF6veIO/UiLCZutKLungcZfBfuigzMr0zAXsXMM6otAMmmo5A\nUmmTKXzatRMVSFiBtGne9d+Ndy03Xu8T7Zg49sw28TE/+8hgBXqLwKGo/r21Fbkl\n9zwmeRIYOPVLPJL3CgwcYBI=\n-----END PRIVATE KEY-----\n",
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


// app.use(express.json())
app.use(bodyParser.json({limit: '50MB' }))

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

console.log(__dirname)


app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/build/index.html'))
})
app.listen(PORT, ()=>{
    console.log(`server running on : http://localhost:${PORT}`)
})
