import dotenv from 'dotenv';
import connectDB from './db/index.js  ';
import {app} from './app.js'

dotenv.config({
path:'./env'
})

connectDB();
app.listen(process.env.PORT || 3000,()=>{
console.log(`Server running at port :${process.env.PORT}`);
})



//Database connection code *********************************

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