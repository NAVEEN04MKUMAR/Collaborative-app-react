const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/user.js'); // Ensure correct path
const bcrypt = require('bcryptjs');
const app = express();
const cors = require('cors');





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
  const { username, password, role } = req.body;
  console.log(`Signup request received: ${username}`);



  if (!username || !password || !role) {
    console.log('Username, password, or role missing');
    return res.status(400).send('Username, password, or role missing');
  }
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    // const user1 = new User({ username, password: hashedPassword, role });
    // await user1.save();
    // console.log(`User created: ${username}`);
    res.status(201).send('User created');
  } catch (err) {
    console.log('Error creating user:', err);
    res.status(500).send('Error creating user');
  }
});

// Fallback route
app.use((req, res) => {
    res.status(404).send('Route not found');
});


//connect to database
mongoose.connect('mongodb+srv://livepolling:livepolling@cluster0.zrr81ak.mongodb.net/')
.then(() => console.log('Database connected'))
.catch(err => console.log('Database connection error:', err));

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


// app.post('/signup',async(req,res)=>{
//     console.log("inside signup");
//     const {username,password,role}=req.body;
//     console.log(`signup request received:${username}`);

//      if (!username || !password || !role) {
//     console.log('Username or password or role missing');
//     return res.status(400).send('Username or password or role missing');
//   }
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user1 = new User({ username, password: hashedPassword,role});
//     await user1.save();
//     console.log(`User created: ${username}`);
//     res.status(201).send('User created');
//   } catch (err) {
//     console.log('Error creating user:', err);
//     res.status(500).send('Error creating user');
//   }
// });




// app.use('/api',documentroute);

// server.listen(5003, () => {
//     console.log('Server running on port 5003');
// });
