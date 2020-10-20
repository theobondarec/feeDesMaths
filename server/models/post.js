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
        default:"no photo"
    },
    pdf:{
        type:String,
        default:"no pdf"
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
})

mongoose.model("Post", postSchema)