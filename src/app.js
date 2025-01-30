// Import the express module to create and manage the server
import express from 'express';

// Import the cors module to enable Cross-Origin Resource Sharing
import cors from 'cors';

// Import the cookie-parser module to parse cookies
import cookieParser from 'cookie-parser';

// Create an instance of an Express application
const app = express();

// Enable CORS (Cross-Origin Resource Sharing) with specific options
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allow requests from this origin (specified in environment variables)
  credentials: true // Allow sending cookies and authentication headers with requests
}));

//What is middleware?***********************************
//Middleware functions are those that have access to the request 
//object (req), response object (res), and the next middleware
//function in the application’s request-response cycle

//Middleware to parse JSON request bodies
// Parse JSON request bodies with a size limit of 10 kilobytes
app.use(express.json({ limit: "10kb" }));

//Middleware to parse URL-encoded request bodies
// Parse URL-encoded request bodies with a size limit of 10 kilobytes
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Use cookie-parser middleware to handle cookies
// This allows the server to access cookies stored in the user's browser
//perform CRUD operations on the cookies in user's browser
app.use(cookieParser());


//routes import
import userRouter from './routes/user.routes.js';


//routes declaration
app.use("/api/v1/users",userRouter);

//http;//localhost:3000/api/v1/users/register


export { app };


