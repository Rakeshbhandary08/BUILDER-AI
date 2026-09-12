import userModel from "../models/User.js";
import jwt from "jsonwebtoken"


const JWT_SECRET=process.env.JWT_SECRET || "fallback_secret"


//Helper function to set cookie
const setSessionCookie=(res,payload)=>{
    const token=jwt.sign(payload,JWT_SECRET,{expiresIn:"30d"})
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge:30*24*60*60*1000,  //Browser's session token
        path:"/"
    })
}



export async function register(req,res){
    const {name,email,password}=req.body;
    
    //All Data is available or not
    if(!name || !email || !password){
       return res.status(400).json({error:"Name, email and password are required"})
    }

    const trimmedEmail=email.toLowerCase().trim();
    
    //if user is already exist in the database
    const existingUser=await userModel.findOne({email:trimmedEmail})
    if(existingUser){
        return res.status(400).json({error:"Email already exits"})
    }

    const user=await userModel.create({name,email:trimmedEmail,password})

    setSessionCookie(res,{userId:user._id,email:user.email})  //res and payload

    res.status(201).json({
        user:{
            _id:user._id,
            name:user.name,
            email:user.email
        }
    })


}

export async function login(req,res){
   const {email,password}=req.body;
    
    //All Data is available or not
    if(!email || !password){
       return res.status(400).json({error:"Email and password is required"})
    }
    
    //if user is already exist in the database
    const user=await userModel.findOne({email:email.toLowerCase().trim()})

    if(!user){
        return res.status(401).json({error:"User don't exist"})
    }

    //validate the password
    const isValid=await user.comparePassword(password)

    if(!isValid){
        return res.status(401).json({error:"Invalid email or password"})
    }

    setSessionCookie(res,{userId:user._id.toString(),email:user.email})

    res.status(201).json({
        user:{
            _id:user._id,
            name:user.name,
            email:user.email
        }
    })
}


export async function logout(req,res){

    res.cookie('token',"",{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge:30*24*60*60*1000,  //Browser's session token
        path:"/"
    })
    return res.json({success:true})
}

export async function me(req,res){
    //req.user={userId:user._id,email:user.email}
    if(!req.user){
        return res.status(401).json({error:"Not authenticated"})
    }
    
    const user=await userModel.findById(req.user.userId).select("-password");

    if(!user){
        return res.status(404).json({error:"User not found"})
    }

    res.json({user})
}