import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const UserSchema=new Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true,lowercase:true,trim:true},
        password:{type:String,required:true}
    },{timestamps:true}
)

//Hash password before saving
UserSchema.pre('save',async function(){
    if(!this.isModified('password')) return;
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})

//compare password method
UserSchema.methods.comparePassword=async function (password){
    return await bcrypt.compare(password,this.password)
}

//create the user model
// Export existing model or compile new one
const userModel=mongoose.models.users || mongoose.model('users',UserSchema)

export default userModel;