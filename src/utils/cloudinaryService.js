import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const uploadOnCloudinary=async (localPath)=>{
try
{
if(!localPath) return null;
//upload the file on cloudinary from local storage
const response=await cloudinary.uploader.upload(localPath,
{
resource_type:"auto"
}
);
console.log(`File uploaded on cloudinary`)
console.log(`*****************************`);
console.log(response);
fs.unlinkSync(localPath);
return response;
}catch(error)
{
//remove the file from the local storage as the upload operation got failed
fs.unlinkSync(localPath);
return null;

}
}

export {uploadOnCloudinary}