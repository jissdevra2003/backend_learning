import express from 'express'
import dotenv from 'dotenv';
import connectDB from './db/index.js  ';
const app=express()

dotenv.config({
path:'./env'
})

connectDB(); 













// (async ()=>{
// try{
// await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
// app.on("error",(error)=>{
// console.log(`Unable to connect to database :${error}`);
// throw error;
// })

// app.listen(process.env.PORT,()=>{
// console.log(`App listening on port ${process.env.PORT}`)

// })

// }catch(error)
// {
// console.error(`Error : ${error}`)
// throw error;
// }
// })();