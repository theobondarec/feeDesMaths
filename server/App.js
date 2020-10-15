const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI} = require('./keys')

require('./models/user')

app.use(express.json())
app.use(require('./routes/auth'))


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
    console.log("dataBase connected")
})
mongoose.connection.on('error', (err)=>{
    console.log(err)
})


app.listen(PORT, ()=>{
    console.log("server running on", PORT)
})


// const customMiddleware = (res, req, next)=>{
//     console.log("Middleware executed")
//     next()
// }

// //Middleware executed every time
// // app.use(customMiddelware)

// app.get('/', (req, res)=>{
//     console.log("HomePage")
//     res.send("HelloWorld")
// })

// app.get('/about', /*customMiddleware,*/ (req, res)=>{   //Middleware executed only for about page
//     console.log("aboutPage")
//     res.send("about this website")
// })