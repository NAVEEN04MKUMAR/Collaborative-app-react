
const Permission=require('./permisionschema')
const seedpermission=async()=>{
    const roles=[
        {
            role:'admin',
            permissions:{
                canedit:true,
                candelete:true,
                canview:true,
                canmanageusers:true,
            }
        },
        {
            role:'editor',
            permissions:{
                canedit:true,
                candelete:true,
                canview:true,
                canmanageusers:false,
             }
          },
          {
            role:'viewer',
            permissions:{
                canedit:false,
                candelete:false,
                canview:false,
                canmanageusers:false,
             }
          },
    ];
    for(let role of roles){
        await Permission.create(role);
    }
};

seedpermission();