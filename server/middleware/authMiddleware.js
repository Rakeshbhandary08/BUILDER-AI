import jwt from "jsonwebtoken";


//Here we verify and destructure the token

export function authMiddleware(req,res,next){
     const token=req.cookies?.token;

     if(!token){
        return res.status(401).json({error:"Access denied. No session token provided."})
     }

     try{

        //Decode the token
        const decoded=jwt.verify(token,process.env.JWT_SECRET|| "fallback_secret") 
        console.log(decoded) //{userId:user._id,email:user.email}
        req.user=decoded;
        next()
     }
     catch(err){
        res.status(401).json({error:"Session expired or invalid. Please sign in again"})
     }
}