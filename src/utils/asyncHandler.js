//writing using promise

//here asyncHandler is a higher order function which is returning 
//another function 

// Define a constant called asyncHandler and set it to a function
// This function takes another function called requestHandler as an argument
const asyncHandler = (requestHandler) => {
  
  // The asyncHandler function returns a new function
  // This new function takes three arguments: req (request), res (response), and next (next middleware function)
  return (req, res, next) => {
    
    // Use Promise.resolve to create a promise from the requestHandler function
    // Call requestHandler with the req, res, and next arguments
    Promise
      .resolve(requestHandler(req, res, next))
      // If an error occurs in requestHandler, catch the error
      // Call the next function with the error, passing it to the next middleware
      .catch((err) => next(err));
  };
};

// Export the asyncHandler function so it can be imported and used in other files
export { asyncHandler };


//***************short version********************** */
// const asyncHandler=(requestHandler)=>{
// (req,res,next)=>{
// Promise
// .resolve(requestHandler(req,res,next))
// .catch((err)=>next(err))
// }
// }
// export {asyncHandler}

//*********************************************** */

//writing using higher order function and try catch block

// const asyncHandler=(fn)=>
// {
// return async (req,res,next) =>
// {
// try{
// await fn(req,res,next);

// }catch(error)
// {
// res.status(error.code || 500).json({
// success:false,
// message:error.message
// })
// }
// }

// }