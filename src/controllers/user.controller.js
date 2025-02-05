import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinaryService.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';


const generateAccessAndRefreshToken= async (userId)=>{
try{
const user=await User.findById(userId);
const accessToken=user.generateAccessToken();
const refreshToken=user.generateRefreshToken();
user.refreshToken=refreshToken;          //save the refreshToken in database
await user.save({ validateBeforeSave:false });  
 return {accessToken,refreshToken};  

}catch(error)
{
throw new ApiError(500,"Error while generating access and refresh tokens");
}


}
const refreshAccessToken=asyncHandler(async (req,res)=>{
const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken;

if(!incomingRefreshToken) throw new ApiError(400,"Invalid refresh token");

try{
const decodedTokenInfo=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
if(!decodedTokenInfo) throw new ApiError(401,"Invalid refresh token");

const user=await User.findById(decodedTokenInfo._id);
if(!user) throw new ApiError(401, "Failed to refresh access token");

if(incomingRefreshToken!== user.refreshToken) throw new ApiError(400,"Invalid refresh token");

const options={
httpOnly:true,
secure:true
}

//new refreshedToken
const {accessToken,refreshedToken}=await generateAccessAndRefreshToken(decodedTokenInfo._id);

return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshedToken,options)
.json(
new ApiResponse(200,
{
accessToken,
refreshToken:refreshedToken
},
"Access token refreshed"
)
)

}
catch(error)
{
throw new ApiError(401, "Invalid refresh token");
}

})



const registerUser=asyncHandler( async (req,res)=>{

//re.body only contains the text not the image files.
//for images we use multer
console.log(req.body);   //contains text fields only

//contans image/video fields and provided by multer middleware
console.log(req.files);  

const {userName,fullName,email,password} =req.body
console.log(`Name:${fullName},Email:${email}`);

if(fullName==="") throw new ApiError(400,"Full name is required");
if(password.length<8) throw new ApiError(400,"Password must contain 8 characters");

//another way to do checks 
let emptyField="";
if(
[userName,email,password].some((field)=>{
if(field==null) throw new ApiError(400,"Fields empty");
field.trim();
if(field==="") 
{
emptyField=field;
return true;
}
return false;
})
)
{
throw new ApiError(400,`${emptyField} is required`);
}

////check if userName or email exists in the database
//this 'User' communicates with the mongodb database
 const userExists=await User.findOne({
$or:[{ userName },{ email }]   //if email or userName exist in the database then error
                                //user already exists
})
if(userExists) throw new ApiError(400,"User already exists");

//now handling images
//req.files is provided by multer (upload.fields ke through)


// const avatarLocalPath=req.files?.avatar[0]?.path;  
//const coverImageLocalPath=req.files?.coverImage[0]?.path;

let coverImageLocalPath="";
if(req.files && req.files.coverImage && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 )
{
coverImageLocalPath=req.files.coverImage[0].path;
}
else 
{
throw new ApiError(400,"Cover image not found");
}

//if(!avatarLocalPath) throw new ApiError(400,"Avatar image not found");
let avatarLocalPath="";
if(req.files && req.files.avatar && Array.isArray(req.files.avatar) && req.files.avatar.length>0)
{
avatarLocalPath=req.files.avatar[0].path;
}
else 
{
throw new ApiError(400,"Avatar not found");
}

//now upload the image on cloud using cloudinary
//response recieved from cloudinary
const avatar=await uploadOnCloudinary(avatarLocalPath);
const coverImage=await uploadOnCloudinary(coverImageLocalPath);

if(!avatar) throw new ApiError(400,"Avatar image not found");
//console.log(avatar);

//now create a object of user containing user data and add it to database

const user=await User.create({
userName:userName.toLowerCase(),
email,
avatar:avatar.url,
coverImage:coverImage?.url || "",
password,
fullName:fullName.toLowerCase(),
avatar_public_id:avatar.public_id,
coverImage_public_id:coverImage.public_id

});

//select me wo chije likte he jo nhi chahiye object me with '-' sign
const createdUser=await User.findById(user._id).select(
"-password -refreshToken"
); 

if(!createdUser) throw new ApiError(500,"Unable to process user information");

console.log(createdUser);

return res.status(201).json(
new ApiResponse(200, createdUser, "User registered successfully")
)

})

const loginUser=asyncHandler(async (req,res)=>{

//validate the fields empty/wrong entry 
//check if found in the DB 
//if not found return 
//if found check userName or email and password
//if wrong email or password entered, return
//password correct then generate access and refresh token
//send cookie

const {email,userName,password}=req.body;
console.log(req.body)

if(!userName && !email) throw new ApiError(400,"user name or email required to log in");


if(password.trim()==="") throw new ApiError(400,"Incorrect password");


//if found on the basis of userName or email to user m ajaega wo object 
const user=await User.findOne({      //here User is object of mongoose
$or:[{email},{userName}]             //user is object of userSchema
}
)
//if not found throw error
if(!user) throw new ApiError(400,"User not found");

//user is object of userSchema
const validPassword=await user.isPasswordCorrect(password);   

if(!validPassword)
{
throw new ApiError(400,"Incorrect password");
}

const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id);
//generateAccessAndRefreshToken ki wjh se user me user.refreshToken add hogya hh
//kyuki refresh token database m bhi store krte hh

//to ab wo naya user extract krlenge
const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

//now send cookie to user
const options={
httpOnly:true,
secure:true
}

return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
new ApiResponse(200,
{
user:loggedInUser,
accessToken,
refreshToken
},
"User logged in successfully"
)
)


})


const logoutUser=asyncHandler(async (req,res)=>{

await User.findByIdAndUpdate(
req.user._id,   //from verifyJWT middleware we added user to req object
{
$set:{
refreshToken:undefined
}
},
{
new:true
}
)

const options={
httpOnly:true,
secure:true
}

//now clear the cookies
return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(
new ApiResponse(200,{},"Logged out successfully")
)

})

const changePassword=asyncHandler(async (res,req)=>{
const {oldPassword,newPassword}=req.body;

const user=User.findById(req.user?._id);
const isPasswordValid=await user.isPasswordCorrect(oldPassword);

if(!isPasswordValid) throw new ApiError(400,"Wrong password entered");

user.password=newPassword;
await user.save({validateBeforeSave:false});

return res
.status(200)
.json(
new ApiResponse(200,{},"Password changed successfully")
)


})

const getCurrentUser=asyncHandler(async (res,req)=>{
return res.
status(200)
.json(200,req?.user,"Current user fetched");
})

const updateAccountInfo=asyncHandler(async(req,res)=>{
const {userName,fullName}=req.body;

if(!fullName || !userName) throw new ApiError(400,"Provide valid fields to update");



const user=await User.findByIdAndUpdate(
req.user?._id,
{
//set operator
$set:{
fullName:fullName,
userName:userName
}
},
{
new:true
}
).select("-password -refreshToken");

return res
.status(200)
.json(
new ApiResponse(200,user,"Details updated successfully")
)



})

const updateUserAvatar=asyncHandler(async (req,res)=>{

let avatarLocalPath;

if(req.file && req.file.path)
{
avatarLocalPath=req.file.path;
}
const avatar=await uploadOnCloudinary(avatarLocalPath);
let oldAvatarImage;
const user=await User.findByIdAndUpdate(
req.user?._id,
{
$set:{
avatar:avatar.url
}
},
{
new:true
}
).select("-password -refreshToken");

return res
.status(200)
.json(
new ApiResponse(200,user,"Avatar updated successfully")
)



})

const updateUserCoverImage=asyncHandler(async (req,res)=>{
if(req.file && req.file.path)
{
const coverImageLocalPath=req.file.path
}
if(!coverImageLocalPath)
{
throw new ApiError(400,"Cover image not found");
}

const coverImage=await uploadOnCloudinary(coverImageLocalPath);

if(!coverImage.url) throw new ApiError(400,"Cover image failed to upload on cloud");
const user=await User.findByIdAndUpdate(
req.user?._id,
{
$set:{
coverImage:coverImage.url
}
},
{
new:true
}
).select("-password -refreshToken")

return res
.status(200)
.json(new ApiResponse(200,user,"Cover image updated successfully"));

})


export 
{
registerUser,
loginUser,
logoutUser,
refreshAccessToken,
getCurrentUser,
changePassword,
updateAccountInfo,
updateUserAvatar,
updateUserCoverImage
}
