import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";


//verify user token and add user to the req object ===> (req.user) 
export const verifyJWT=asyncHandler(async (req,res,next)=>{


try {
  //custom token from user 
  //comes in req.header("Authorization":"Bearer <token_name>")
//key:"Authorization"  value:"Bearer <token_name>"
  const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ",""); 
  
  if(!token) throw new ApiError(400,"Invalid access token"); 
//now verify and decode the token
const decodedTokenInfo=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

const user=await User.findById(decodedTokenInfo._id).select("-password -refreshToken");

if(!user) throw new ApiError(400,"Invalid access token");

//now add the user object in the req object
req.user=user;
next();

} catch (error) {
throw new ApiError(400,"Invalid access token");
  
}

})