const mongoose = require('mongoose');
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
    try {
        for (let role of roles) {
            await Permission.create(role);
        }
        console.log('Permissions seeded successfully');
    } catch (err) {
        console.error('Error seeding permissions:', err);
    }
};



//connect to database
mongoose.connect('mongodb+srv://pwskills:pwskills@cluster0.zrr81ak.mongodb.net/pwskills')
.then(() => console.log('Database connected'))
.catch(err => console.log('Database connection error:', err));


seedpermission();