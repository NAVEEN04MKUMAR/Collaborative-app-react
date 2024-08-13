// const checkrole=(roles)=>{
//     return (req,res,next)=>{
//         const token=req.header('Authorization');
//         if(!token)
//         return res.status(401).send('access denied no token provided');
//     try{
//         const decoded=jwt.verify(token,jwt_secret);
//         req.user=decoded;

//         if(!roles.includes(req.user.role)){
//             return res.status(403).send('access denied');
//         }

//         next();
//     }catch(ex){
//         res.status(400).send('invalid token');
//     }

//     };
// };

// module.exports=checkrole;
