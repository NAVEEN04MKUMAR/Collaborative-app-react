
const Permission=require('../model/permisionschema');
const checkpermission=(requiredpermission)=>{
    return async (req,res,next)=>{
        const user=req.user;
        const userroles=req.user.roles;
        const permision=await Permission.findOne({role:user.role});
        

        if(permision&&permision.permissions[requiredpermission]){
            next();
        }
        else{
            req.tatus(403).json({message:"forbidden"});
        }

    };
};
module.exports=checkpermission;
