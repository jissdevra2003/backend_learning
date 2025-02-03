import mongoose from 'mongoose'
//import mongoose ,{Schema} from 'mongoose;
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';



const userSchema=new mongoose.Schema({
userName:{
type:String,
required:true,
unique:true,
lowercase:true,
trim:true,
index:true   //for optimized search operation
},
email:{
type:String,
unique:true,
lowercase:true,
required:true,
},
fullName:{
type:String,
required:true,
trim:true
},
avatar:{
type:String,   //string will be accepted as URL from cloudinary
required:true,
},
coverImage:{
type:String,
},
watchHistory:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"Video"
}
],
password:{
type:String,
required:[true,"Password is required"],  //custom error message, can be given with any property

},
refreshToken:{
type:String,
}
},
{
timestamps:true
}
);


//encrypt the password before saving using 
//the pre hook from mongoose
//pre hook will be called before saving the password 
userSchema.pre("save",async function(next)
{
if(!this.isModified("password")) return next();
this.password=await bcrypt.hash(this.password,10);
next();
})


//to write custom hooks , using (methods)
userSchema.methods.isPasswordCorrect=async function(password)
{
return await bcrypt.compare(password,this.password);
}



// Define a method named 'generateAccessToken' on the 'userSchema' object
//This method generates a secure access token for a user,
//embedding their information within the token and signing it 
//with a secret key. The token has an expiration time to enhance security.

userSchema.methods.generateAccessToken = function() {

//************************************ */
// Call the // 'jwt.sign()' // function to create a new JWT (JSON Web Token)
//The jwt.sign() function is used to create a new JSON Web Token (JWT). 
//This token will be used for user authentication.

//1st argument*********************************
// The first argument is the payload(data), which is an object containing 
//the user's data
//This data will be embedded in the token.

    return jwt.sign(
{
_id: this._id,          // Add the user's unique ID to the payload
email: this.email,      // Add the user's email to the payload
userName: this.userName // Add the user's username to the payload
},
//2nd argument*******************************
// The second argument is the secret key used to sign the JWT token
process.env.ACCESS_TOKEN_SECRET, 

{
//3rd argument**********************************
// The third argument is an options object specifying the token's expiry time
//This is an options object that specifies how long the token
//will be valid. The expiresIn property is set to the value 
//of an environment variable, which defines the token's expiry time.

expiresIn: process.env.ACCESS_TOKEN_EXPIRY 

}
);
};



userSchema.methods.generateRefreshToken=function()
{
return jwt.sign(
{
_id:this._id
},
process.env.REFRESH_TOKEN_SECRET,
{
expiresIn:process.env.REFRESH_TOKEN_EXPIRY
}  

)
}


//in mongodb this model 'User' will be saved with name
// as (plural+lowercase) - users
export const User=mongoose.model("User",userSchema);