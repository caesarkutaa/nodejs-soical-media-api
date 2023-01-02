const User = require('../models/User')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError,UnauthenticatedError} = require('../errors')
 
//create user
const createUser = async(req,res)=>{
    const user =  await User.create({...req.body})  
    const accesstoken = user.createjwt()
    res.status(StatusCodes.CREATED).json({user,accesstoken})
}
 const  loginUser = async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).send('invalid email and password')
    }
    const user = await User.findOne({ email  })
    //checking if there is a user
    if(!user){
   return res.status(StatusCodes.UNAUTHORIZED).send('invalid email')
    }
    //compare password using bycrypt in the models    
    const ispasswordcorrect = await user.comparepassword(password)
    if(!ispasswordcorrect){
        return res.status(StatusCodes.UNAUTHORIZED).send('invalid password')
    }
    //creating a token and geting the user name (code found in models.user)
    const accesstoken = user.createjwt()
    res.status(StatusCodes.OK).json({user,accesstoken})
  
 }
   const getUser = async(req,res)=>{
    const user = await User.findById(req.params.id)
    //this will not dispaly these propertise
    const {password,createdAt,updatedAt, ...other} = user._doc
    res.status(200).json(other)
   }

   const updateUser = async(req,res)=>{
         if(req.body.userId === req.params.id || req.body.isAdmin){
             const user = await User.findByIdAndUpdate(req.params.id,{$set: req.body})
                res.status(StatusCodes.OK).json('acct updated')
             }else{
                return res.status(403).json('ypu can only dee your acc')
            }
   }
   const deleteUser = async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        const user = await User.findByIdAndRemove(req.params.id)
           res.status(StatusCodes.OK).json('remove succeess')
    }else{
        return res.status(403).json('ypu can only delete your acc')
    }
}

const followUser = async(req,res)=>{
    // firstly check whether this users are the same
  if(req.body.userId !== req.params.id){
  try {
    //the user with the id
     const user = await User.findById(req.params.id)
     //the user try to make the request
     const currentUser = await User.findById(req.body.userId)
     if(!user.followers.includes(req.body.userId)){
        //pushes to the user  to unfollow fellowers
   await user.updateOne({$push:{followers:req.body.userId}})
   //pushes to your unfollow
   await currentUser.updateOne({$push:{following:req.params.Id}})
   res.status(200).json('user has been followed')
     }else{
        res.status(403).json('you are already fellowing user')
     }
  } catch (error) {
    res.status(500).json(error)
  }
  }else{
    //if the user are the same send this
    res.status(StatusCodes.FORBIDDEN).json('you cant fellow yourself')
  }


}


const unfollowUser = async(req,res)=>{
    // firstly check whether this users are the same
  if(req.body.userId !== req.params.id){
  try {
    //the user with the id
     const user = await User.findById(req.params.id)
     //the user try to make the request
     const currentUser = await User.findById(req.body.userId)
     if(user.followers.includes(req.body.userId)){
        //pushes to the user followers
   await user.updateOne({$pull:{followers:req.body.userId}})
   //pushes to your following
   await currentUser.updateOne({$pull:{following:req.params.id}})
   res.status(200).json('user has been unfollowed')
     }else{
        res.status(403).json('you dont fellow user')
     }
  } catch (error) {
    res.status(500).json(error)
  }
  }else{
    //if the user are the same send this
    res.status(StatusCodes.FORBIDDEN).json('you cant unfellow yourself')
  }


}





module.exports ={
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getUser,
    followUser,
    unfollowUser
}