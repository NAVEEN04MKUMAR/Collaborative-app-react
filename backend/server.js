const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const bodyparser=require('body-parser');
const cors = require('cors');
const passport=require('passport');
const googlestrategy=require('passport-google-oauth20').Strategy;

const http=require('http');
const {Server}=require('socket.io');

const checkrole=require('./middleware/checkrole');
const user=require('./model/user');


const app=express();
const server=http.createServer(app);

app.use(cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
    credentials: true // If you need to handle cookies or other credentials
  }));


  const io=new Server(server,
   {
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
        credentials: true, 
    },}
  );

const port=5003;
app.use(bodyparser.json());
//  app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

let text="";

io.on('connection',(socket)=>{
    console.log('new client connected',socket.id);

    //send the current text to the newly conneced to the client
    socket.emit('load-text',text);

    //listen for text updates from clients
    socket.on('update-text',(newtext)=>{
        try{
            text=newtext;
            socket.broadcast.emit('update-text',newtext);
        }catch(error){
            console.error('error listen for text message:',error);
        }
    });

    socket.on('edit',(data)=>{
        try{
            socket.broadcast.emit('edit',data);
        }catch(error){
            console.error('error sending message:',error);
        }
    });

    socket.on('message',(data)=>{
        try{
            io.emit('message',data);
        }catch(error){
            console.error('error sending message:',error);
        }
    });

    socket.on('disconnect',()=>{
        console.log('client disconnected',socket.id);
    });

    socket.on('updatetext',(text)=>{
        try{
            socket.broadcast.emit('updatetext',text);
        }catch(error){
            console.log('error updating text',error);
        }
    });
});
const jwt_secret='';
app.use(passport.initialize());



//google oauth
passport.use(new googlestrategy({
    clientID:'167791506952-nso9e3t98lamqbqqboi0pnfjdl0849t2.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'http://localhost:5002/auth/google/callback'
},
function(accesstoken,refreshtoken,profile,done){
    const user={id:profile.id,name:profile.displayname};
    return done(null,user);
}));

app.get('/auth/google',
    passport.authenticate('google',{scope:['profile','email']}));

app.get('/auth/google/callback',
        passport.authenticate('google',{session:false}),
        (req,res)=>{
            const token=jwt.sign(req.user,jwt_secret,{expiresIn:'1h'});
            res.redirect(`http://localhost:3000?token=${token}`);
        });
    
//protected route
app.get('/protected',(req,res)=>{
    res.send('this is a protected route');
    const token=req.header('Authorization');
    if(!token) return res.sendStatus(401);

    jwt.verify(token,jwt_secret,(err,user)=>{
        if(err) return res.sendStatus(403);
        res.json(user);
    });

});













app.get('/admin',passport.authenticate('jwt',{session:false}),checkrole(['admin']),(req,res)=>{
    res.send('this is an admin route');
});

app.get('/dashboard',passport.authenticate('jwt',{session:false}),checkrole(['admin','user']),(req,res)=>{
    res.send('this is an dashboard access to the both admin and user');
});




//connect to database
mongoose.connect('mongodb+srv://pwskills:pwskills@cluster0.zrr81ak.mongodb.net/pwskills')
.then(() => console.log('Database connected'))
.catch(err => console.log('Database connection error:', err));



//login
app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    console.log(`login request received:${username}`);
    const user2=await user.findOne({username});
    if(!user2){
        console.log(`user not found:${username}`);
        return res.status(400).send('user not found');
    }
    const ispasswordvalid=await bcrypt.compare(password,user2.password);
    if(!ispasswordvalid){
        console.log(`invalid password for user:${username}`);
        return res.status(400).send('invalid password');
    }
    const token=jwt.sign({userId:user2._id},jwt_secret,{expiresIn:'1h'})
    console.log(`token generated for user:${username}`);
    res.json({token});

});

//verify the token
    const authenticationtoken=(req,res,next)=>{
        const token=req.header('Authorization');
        if(!token) return res.sendStatus(401);

        jwt.verify(token,jwt_secret,(err,user)=>{
            if(err)return res.sendStatus(403);
            req.user=user;
            next();
        });
    };



app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})




