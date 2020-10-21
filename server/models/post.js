const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    matiere:{
        type:String,
        required:true
    },
    chapitre:{
        type:String,
        required:true
    },
    lecon:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    cours:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    pdf:{
        type:String,
        required:true
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
})

mongoose.model("Post", postSchema)