import userModel from "../models/User";



export async function register(res,req){
    const {name,email,password}=req.body;
    
    //All Data is available or not
    if(!name || !email || !password){
       return res.status(400).json({error:"Name, email and password are required"})
    }

    const trimmedEmail=email.toLowerCase().trim();
    
    //if user is already exist in the database
    const existingUser=userModel.findOne({email:trimmedEmail})
    if(existingUser){
        return res.status(400).json({error:"Email already exits"})
    }

    const user=await userModel.create({name,email:trimmedEmail,password})


}

export async function login(res,req){
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        
    }
}


export async function loguut(res,req){
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        
    }
}

export async function me(res,req){
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        
    }
}