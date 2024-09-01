const express=require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
// app.use(bodyparser.json()); 
app.use(express.json()); // Instead of body-parser


// let operations = [];

mongoose.connect('mongodb+srv://livepolling:livepolling@cluster0.zrr81ak.mongodb.net/livepolling',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>console.log('connected to db'))
.catch(err=>console.log(err));

app.use(cors({
  origin: 'http://localhost:3000', // Change as per your frontend URL
  credentials: true
}));




app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

const server=http.createServer(app);



const io=socketio(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"],
    credentials:true
  }
});

let currenteditorcontent="This is the initial paragraph text.";

io.on('connection',(socket)=>{
  // console.log('Emitting initial content:', currenteditorcontent);
  console.log('user created',socket.id);

  //send this one to the newly connected client
  socket.emit('receive-initial-text',{ text:currenteditorcontent});
  
  
  socket.on('sendmessage',(message)=>{
    console.log('received message',message);
    io.emit('received message,',message);
  });

  socket.on('send-delta',({ delta, senderid })=>{
    // console.log('received message',delta);   
     // const {delta,senderid}=data; 
     console.log('Delta received from client:',senderid,delta);
    
    
      // Broadcast the received delta to all other clients except the sender
      socket.broadcast.emit('receive-delta',{ delta, senderid });
  });


  socket.on('comment-added',(data)=>{
    io.emit('receive-notification',{
      type:'comment',
      message:`${data.username} commented:"${data.commenttext}" on ${data.documentid}`
    });
  });

  socket.on('document-edited',(data)=>{
    io.emit('receive-notification',{
      type:'edit',
      message:`${data.username} edited document on ${data.documentid}`
    });
  });

  // Send the initial data to the new client
  socket.emit('cell-update', spreadsheetData);

  // Handle cell updates
  socket.on('update-cell', (updatedata) => {
      spreadsheetData = updatedata;
      // Broadcast the update to all connected clients
      socket.broadcast.emit('cell-update', updatedata);
  });
  
  socket.on('disconnect',()=>{
    console.log('user disconneced',socket.id);
  });


});






      //15/08
function transform(opA,opB){
    if(opA.type==='insert'&&opB.type==='insert'){
      if(opA.possition<=opB.possition){
        opB.possition++;
      }else{
        opA.possition++;
      }
    }
  
  
    if(opA.type==='delete'&&opB.type==='insert'){
      if(opA.possition<=opB.possition){
        opB.possition--;
      }
    }
    return opB;
  }
  



  const Documentschema=new mongoose.Schema({
    tittle:String,
    content:String,
    author:String,
    versions:[
        {
            versionnumber:Number,
            content:String,
            author:String,
            timestamp:{type:Date,
              default:Date.now
            }
        }
    ],

});
const Document=mongoose.model('Document',Documentschema);

app.get('/', (req, res) => {
  res.send("Server is running!");
});

app.post('/documents/create',async(req,res)=>{
  console.log('i am inside the create');
  console.log('Request body:', req.body); 
  // res.status(200).send("Request received");
  const {tittle,content,author}=req.body;

  try{

    const newdocument=new Document({
      tittle:tittle,
      content:content,
    versions:[
      {
    versionnumber:1,
    content:content,
    author:author,
    timestamp:new Date(),
    },
  ]
    });
    console.log('Saving document...');
    const saveddocument=await newdocument.save();
    console.log('Document saved:', saveddocument);
    
    
    
    res.status(201).json({
      message:'document creted successfully',
      document:saveddocument})
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error creating document', error: err });
  }


  });

  



app.post('/documents/:id/update',async(req,res)=>{
  const {id}=req.params;
  const {newcontent,author}=req.body;

  //find document
  let document=await Document.findById(id);

if(!document){
  return res.status(404).json({message:'document not found'})
}

  //create the newversion then pass to the version array
  const newversions={    
        versionnumber:document.versions.length+1,
        content:document.content,
        author:author,
        timestamp:new Date(),
    };

//update the document content nd add the new version
    document.versions.push(newversions);
    document.content=newcontent;
    document.author = author;
    await document.save();
    res.json({message:'document updated and the version saved'});

    io.emit('document-added',{
      documentid:id,
      newcontent:newcontent,
      author
    });
    res.json({ message: 'Document updated' });
  });


  app.get('/documents/:id/history',async(req,res)=>{
    console.log('Request received at backend');
    // console.log('request',req);
    const {id}=req.params;
    console.log('id',id)
  
    try{
    //find document
    let document=await Document.findById(id).select('versions');  
    if(!document){
    return res.status(404).json({message:'document not found'})
     }

     res.json(document.versions); 
    }catch(err){
      console.error('Error fetching document:', err);
      res.status(500).json({ message: 'Error fetching document', error: err.message });

    }   
});

  app.post('/documents/:id/revert',async(req,res)=>{
    const {id}=req.params;
    const {versionnumber}=req.body;
    console.log(`Reverting document ID ${id} to version ${versionnumber}`);
    //find document
    let document=await Document.findById(id);

    const selectedversion=document.versions.find(v=>v.versionnumber===versionnumber);
    if(selectedversion){
      document.content=selectedversion.content;
      document.author=selectedversion.author;
      await document.save();
      res.json({message:`document reverted to version ${versionnumber}`});
    }else{
      res.status(404).json({message:'version not found'});
    }
      });
  

      const commemtschema=new mongoose.Schema({
  selectedtext:{type:String},
  documentid:{type:String,required:true},
  text:{type:String,required:true},
  comment: String,
  date: {
     type: Date, 
     default: Date.now,
   },

});

const comment=mongoose.model('comment',commemtschema);


app.post('/comments',async(req,res)=>{
  const {documentid,selectedtext}=req.body;
  console.log('request body',req.body);

  console.log('Received comment submission:');
  console.log(`Document ID: ${documentid}`);
  console.log(`Selected Text: ${selectedtext}`);
  const text = req.body.text; 
  console.log(`Comment: ${text}`);
  try
  {

    console.log('Data being sent to Comment.create():', {
      documentid,
      selectedtext,
      text,
  });


    const newcomment=new comment({
      documentid,
     selectedtext,
     text,
      // parantid,
      // userid,
    });
    await newcomment.save();
    console.log('Successfully created new comment:', newcomment);
    res.status(201).json(newcomment);

    io.emit('comment-added',{
      documentid,
      selectedtext,
      text:comment.text
    });
  }
  catch(err){
    console.error('Error creating comment:', err);
    res.status(500).json({message:'server error',err});
  }
});




// app.get('/set-cookie', (req, res) => {
//   // Set a cookie on the response object
//   res.cookie('myCookie', 'cookieValue', {
//     sameSite: 'None',
//     secure: true,
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000 // 1 day
//   });

//   res.send('Cookie has been set');
// });

app.get('/documents/:id',async(req,res)=>{
   console.log(`Fetching document with ID: ${req.params.id}`);
  const  documentId  = req.params.id;
  console.log(` documentid with ID: ${documentId}`);
  
  try
  {
    const document = await Document.findById( documentId );
    console.log( 'document',document);

    if (!document) {
        return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document);
  }  catch(err){
    res.status(500).json({message:'server error',err});
  }
});


app.get('/comments',async(req,res)=>{
  
  try
  {
    const comment=await comment.find();
    res.status(201).json(comment);
  }
  catch(err){
    res.status(500).json({message:'server error',err});
  }
});

app.get('/comments/:documentid',async(req,res)=>{
  const {documentid}=req.params;
  const comments=await comment.find({
    documentid}).populate('replies');
  res.json(comments);
});


// In-memory storage for spreadsheet data
let spreadsheetData = [
  ['', 'A', 'B', 'C'],
  ['1', '', '', ''],
  ['2', '', '', ''],
  ['3', '', '', ''],
];

// Serve static files (e.g., frontend assets)
app.use(express.static('public'));

// Get spreadsheet data
app.get('/spreadsheet', (req, res) => {
  res.json(spreadsheetData);
});

// Update spreadsheet data
app.post('/spreadsheet', (req, res) => {
  const { data } = req.body;
  if (Array.isArray(data)) {
      spreadsheetData = data;
      res.status(200).json({ message: 'Spreadsheet data updated successfully' });
  } else {
      res.status(400).json({ error: 'Invalid data format' });
  }
});





  
const PORT = 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

