require('dotenv').config();
require('express-async-errors');



const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const  connectDB = require('./DB/connect')
const authH = require('./middleware.js/auth')
const userRouter = require('./router/User')
const postRouter = require('./router/Post')

app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.get('/home',(req,res)=>{
  res.send('helloo node')
})
app.use('/api/v1/user', userRouter)
app.use('/api/v1/post', postRouter)


const port = process.env.PORT || 8800;



const start = async () => { 
    try {
         await connectDB (process.env.MONGO_URL)
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error); 
    }
  };
  
  start();