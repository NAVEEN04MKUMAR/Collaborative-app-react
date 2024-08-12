





const jwt=require('jsonwebtoken');
const User=require('../model/user');
const authenticate=async(req,res,next)=>{
    const token=req.header('Authorization').replace('Bearer ','');
    try{
        const decoded=jwt.verify(token,'ed115beb62651108a829bd370f097a4507724032588b029b235d2e778f09045a27a065827bdf716505ebcbab27ea328b5ef40234f0ef45cf46cd43f1335a77cf');
        const user=await User.findById(decoded.id);
        if(!user){
            throw new Error();
        }
        req.user=user;
        next();
    }catch(err){
        res.status(401).json({message:'unauthorized:invalid token'});
     }

};
module.exports=authenticate;