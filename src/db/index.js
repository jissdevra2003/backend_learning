import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'
import 'dotenv/config'

async function connectDB()
{
try
{
const connectionObj=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
console.log(`\nMongoDB connected DB Host :${connectionObj.connection.host}`);
console.log(`\n${connectionObj}`);
}catch(error)
{
console.error(`Database connection error :${error}`)
process.exit(1);
}
}

export default connectDB;