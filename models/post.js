const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

const  POSTSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    
   images:{
        type:String,
    },
   likes:{
        type:Array,
        default:[]
    },

   dislike:{
        type:Array,
        default:[]
       
    },
    desc:{
        type:String,
        max:500
    },
 
    
},{ timestamps:true })


module.exports = mongoose.model('POST',POSTSchema)