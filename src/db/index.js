import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'
import 'dotenv/config'

const connectDB=async ()=>{
try
{
const connectionObj=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
console.log(`Database connected successfully`);
//console.log(connectionObj);
}catch(error)
{
console.log(`Unable to connect to Database`);
}

}
export default connectDB;