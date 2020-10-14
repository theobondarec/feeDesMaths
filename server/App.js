const express = require('express')
const app = express()

const customMiddleware = (res, req, next)=>{
    console.log("Middleware executed")
    next()
}

//Middleware executed every time
// app.use(customMiddelware)

app.get('/', (req, res)=>{
    console.log("HomePage")
    res.send("HelloWorld")
})

app.get('/about', /*customMiddleware,*/ (req, res)=>{   //Middleware executed only for about page
    console.log("aboutPage")
    res.send("about this website")
})

const PORT = 5000
app.listen(PORT, ()=>{
    console.log("server running on", PORT)
})