const express=require('express');
const authenticate=require('../middleware/authenticate');
const authorize=require('../middleware/authenticate');

const router=express.Router();

router.post('/documents',authenticate,(req,res)=>{
    res.statusCode(201).json({message:'document creaate successfully'});
});

router.delete('/documents/:id',authenticate,(req,res)=>{
    res.statusCode(200).json({message:'document deleted successfully'});
});


module.exports=router;

//authorize('canedit')
//authorize('candelete'),