const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send("HelloWorld")
})

const PORT = 5000
app.listen(PORT, ()=>{
    console.log("server running on", PORT)
})