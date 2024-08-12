const mongoose=require('mongoose');

const Permissionschema=new mongoose.Schema({
    role:{type:String,required:true,unique:true},
    permissions:{
        canedit:{type:Boolean,default:false},
        candelete:{type:Boolean,default:false},
        canview:{type:Boolean,default:true},
        canmanageusers:{type:Boolean,default:false},
    }

})


const Permission=mongoose.model('Permission',Permissionschema);
module.exports=Permission;