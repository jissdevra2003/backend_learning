import {Router} from "express";
import {loginUser,registerUser,logoutUser,refreshAccessToken,changePassword} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';


const router=Router();
router.route("/register").post(          

upload.fields([       //multer middleware execution before controller execution
                      //to save image files in local storage
{
name:"avatar",
maxCount:1
},
{
name:"coverImage",
maxCount:1
}
])
,registerUser);

router.route("/login").post(loginUser);

//secure routes (after login-user should be logged in)
//verifyJWT is the middleware to get req.user  
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(changePassword);

export default router;