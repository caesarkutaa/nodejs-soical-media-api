const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const USERSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    followers:{
        type:Array,
        default:""
    },
    following:{
        type:Array,
        default:""
    },

    phonenumber:{
        type:Number,
        required:true,
        maxlength:11,
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    desc:{
        type:String,
        max:30
    },
    city:{
        type:String,
        max:20
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
},{ timestamps:true })

    USERSchema.pre('save',async function(next){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
        next()
    })

    USERSchema.methods.createjwt = function() {
        return jwt.sign({userId: this._id, name: this.username}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFECYCLE})
    }
    USERSchema.methods.comparepassword = async function (userpassword){
        const ismatch = await bcrypt.compare(userpassword,this.password)
          return ismatch
    }

module.exports = mongoose.model('Users',USERSchema)