const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/rollschema'); // Ensure correct path
const bcrypt = require('bcryptjs');
const app = express();
const cors = require('cors');
const jwt=require('jsonwebtoken');

const jwt_secret = 'ed115beb62651108a829bd370f097a4507724032588b029b235d2e778f09045a27a065827bdf716505ebcbab27ea328b5ef40234f0ef45cf46cd43f1335a77cf';



//connect to database
mongoose.connect('mongodb+srv://livepolling:livepolling@cluster0.zrr81ak.mongodb.net/')
.then(() => console.log('Database connected'))
.catch(err => console.log('Database connection error:', err));



app.use(express.json());
 app.use(cors());

// Serve favicon
app.get('/favicon.ico', (req, res) => res.status(204).send());

// Define your routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.get('/test', (req, res) => {
    res.json({ message: 'Test route works!' });
});

app.post('/signup', async (req, res) => {
  console.log("Inside signup");
  const { username, email, password, role } = req.body;
  console.log(`Signup request received: ${username}`);
  console.log(`Signup request received: ${email}`);



  if (!username || !email || !password || !role) {
    console.log('Username, email, password, or role missing');
    return res.status(400).send('Username, email, password, or role missing');
  }
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user1 = new User({ username,email, password, role });
    await user1.save();
    console.log(`User created: ${username}`);
    res.status(201).send('User created');
  } catch (err) {
    console.log('Error creating user:', err);
    res.status(500).send('Error creating user');

  }
});
//login
app.post('/login',async(req,res)=>{
  const {email,password}=req.body;
  console.log(`login request received:${email}`);
  const user2=await User.findOne({email});
  if(!user2){
      console.log(`user not found:${email}`);
      return res.status(400).send('user not found');
  }
  // const ispasswordvalid=await bcrypt.compare(password,user2.password);
  // if(!ispasswordvalid){
  //     console.log(`invalid password for user:${email}`);
  //     return res.status(400).send('invalid password');
  // }
  const token=jwt.sign({userId:user2._id},jwt_secret,{expiresIn:'1h'})
  console.log(`token generated for user:${email}`);
  res.json({token});

});


// Fallback route
app.use((req, res) => {
    res.status(404).send('Route not found');
});



app.listen(5000, () => console.log('Server running on port 5000'));















// const express = require('express');
// const http = require('http');
// const bcrypt = require('bcryptjs');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const mongoose=require('mongoose');


// const User=require('./model/user')
// const documentroute=require('./routes/documentroutes');

// const app = express();
// const server = http.createServer(app);

// //connect to database
// mongoose.connect('mongodb+srv://pwskills:pwskills@cluster0.zrr81ak.mongodb.net/pwskills')
// .then(() => console.log('Database connected'))
// .catch(err => console.log('Database connection error:', err));

// app.get('/', (req, res) => {
//     res.send('Hello, world!');
//   });


// // app.use(cors({
// //     origin: "http://localhost:3000",
// //     methods: ["GET", "POST"],
// //     credentials: true
// // }));

// // const io = socketIo(server, {
// //     cors: {
// //         origin: "http://localhost:3000",
// //         methods: ["GET", "POST"],
// //         credentials: true
// //     }
// // });

// // io.on('connection', (socket) => {
// //     console.log('New client connected');
    
// //     // Example event listener
// //     socket.on('message', (data) => {
// //         console.log('Received message:', data);
// //     });

// //     socket.on('disconnect', () => {
// //         console.log('Client disconnected');
// //     });
// // });






// app.use('/api',documentroute);

// server.listen(5003, () => {
//     console.log('Server running on port 5003');
// });
