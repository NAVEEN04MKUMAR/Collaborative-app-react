
const Permission=require('../model/permisionschema');
const authorize=(requiredpermission)=>{
    return async (req,res,next)=>{
        const user=req.user;
        const userroles=req.user.roles;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const permission=await Permission.findOne({role:user.role});
        

        if(permission&&permission.permissions[requiredpermission]){
            next();
        }
        else{
            req.tatus(403).json({message:"forbidden"});
        }

    };
};
module.exports=authorize;