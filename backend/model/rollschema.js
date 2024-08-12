const mongoose=require('mongoose');

const userschema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:['addmin','editor','viewer'],required:true},

})
//hash the password before saving
userschema.pre('save',async function(next){
    if(this.isModified('password')||this.isNew){
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
    }
    next();
});

userschema.methods.comparepassword=function(candidatepassword) {
    return bcrypt.compare(candidatepassword,this.password);  
};


const User=monoose.model('User',userschema);
module.exports=User;