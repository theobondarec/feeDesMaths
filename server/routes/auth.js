const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

router.post('/register', (req,res)=>{
    const {name, isenId ,email, password}= req.body
    if(!name || !isenId || !email || !password){
        return res.status(422).json({error:"Complete all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"email already exists"})
        }
        bcrypt.hash(password, 12)
        .then(hashedpassword=>{
            const user = new User({
                name,
                isenId,
                email,
                password:hashedpassword
            })
            user.save()
            .then(user=>{
                res.json({message:"user saved"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/login', (req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        res.status(422).json({error:"please fill in all fields"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"}) //wrong email
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed"})
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id, name, email, rank} = savedUser
                res.json({token, user:{_id, name, email, rank}})
            }
            else{
                return res.status(422).json({error:"Invalid email or password"}) //wrong password
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router