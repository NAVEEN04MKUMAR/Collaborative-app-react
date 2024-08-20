
import React,{useState,useEffect} from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import axios from 'axios';
import {io} from 'socket.io-client';

// import {Documenteditor} from './Document_editor';
// import {Roleprovider} from './Rolecontext';


const socket=io('http://localhost:5002');

// Event listener for successful connection
socket.on('connect', () => {
    console.log('Connected to server');
    // Emit a test message to the server
    socket.emit('message', { text: 'Hello, server!' });
});

// Event listener for connection errors
socket.on('connect_error', (error) => {
    if (error.code) {
        console.error('Error code:', error.code);
    }
    if (error.type) {
        console.error('Error type:', error.type);
    }
    if (error.description) {
        console.error('Error description:', error.description);
    }
    });


// Event listener for connection disconnections
socket.on('disconnect', (reason) => {
    console.log('Disconnected from server:', reason);
});


const App=()=>{
    return(
        <Router>
            <Routes> 
                <Route path="/signup" element={<SignupForm/>}/>
                 <Route path="/login" element={<Login/>}/>
        {/*//         <Route path="/login1" element={<Login1/>}/>
        //         <Route path="/Protected" element={<Protected/>}/>
        //         <Route path="/editor" element={<Collaborativeeditor/>}/>  
        //         <Route path="/realtime" element={<Realtimecomponent/>}/>
        //         <Route path="/documenteditor" element={<Documenteditor/>}/>
        //         <Route path="/roleprovider" element={< Roleprovider/>}/>     */}
                 {/* <Route path="/signup"  element={<SignupForm/ >}/> */}
             </Routes>
         </Router>

    //     <Roleprovider>
    //   <Documenteditor />
    // </Roleprovider>
    );
};




const Login1=()=>{
    const handlegooglelogin=()=>{
        // useEffect(()=>{
            window.location.href='http://localhost:5002/auth/google';
        //},[]);
    };
    return(
        <div>
            <h1>Login</h1>
            <button onClick={handlegooglelogin}>login with google</button>
        </div>
    );
};

const Protected=()=>{
    const [user,setuser]=useState(null);
    useEffect(()=>{
        const token=new URLSearchParams(window.location.search).get('token');
        if(token){
            localStorage.setitem('token',token);
            axios.get('/protected',{
                headers:{
                    'Authorization':token
                }
            }).then(response=>{
                setuser(response.data);
            }).catch(error=>{
                console.error('error fetching protected route',error);
            });
        }
    },[]);
    return user?<h1>Welcome,{user.name}</h1>:<h1>Loading...</h1>
};


const Realtimecomponent=()=>{
    const [messages,setmessages]=useState([]);

    useEffect(()=>{
        socket.on('message',(data)=>{
            setmessages((prevmessages)=>[...prevmessages,data]);
    });
    return ()=>{
        socket.disconnect();
    }
    },[]);

    const sendmessage=()=>{
        const message="hello from client";
        socket.emit('message',message);
    };

    return(
        <div>
            <h1>Real time updates</h1>
            <button onClick={sendmessage}>Send message</button>
            <ul>
                {messages.map((msg,index)=>(
                    <li key ={index}>{msg}</li>
                ))}
            </ul>
        </div>
    )



}

//it listen load text and update text events to synchromize the text across all connected client
//whatever changes we make then it will store the changes to the server
const Collaborativeeditor=()=>{
    const [text,settext]=useState('');

//listen for updates fro   the clients
    useEffect(()=>{

    //load the inital text from server
    socket.on('load-text',(initialtext)=>{
        settext(initialtext);
    });
    

    socket.on('update-text',(newtext)=>{
            settext(newtext);
        });

    
      return()=>{
            socket.off('load-text');
            socket.off('update-text');
        };
        
    },[]);

    const handlechange=(e)=>{
        const newtext=e.target.value;
        settext(newtext);
        socket.emit('update-text',newtext);//send the update text to the server
    }

    return (
        <div>
            <h1>Collaborative text editor</h1>
                    <textarea 
        value={text}
        onChange={handlechange}
        rowa="10"
        cols="30"
        />
        </div>
    )
};


const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const userData = { username,email, password, role };
  
      try {
        const response = await axios.post('http://localhost:5000/signup', userData);
        alert(response.data);
      } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Login failed:', error.response.data.message);
            alert(error.response.data.message || 'Login failed. Please try again.');
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
            alert('No response received from server. Please check your network.');
        } else {
            // Something else happened while setting up the request
            console.error('Error:', error.message);
            alert('An error occurred during login. Please try again.');
        }      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setemail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    );
  };
  
//   export default SignupForm;

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            const token = response.data.token;
            localStorage.setItem('token', token); 
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Login failed:', error.response.data.message);
                alert(error.response.data.message || 'Login failed. Please try again.');
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response received:', error.request);
                alert('No response received from server. Please check your network.');
            } else {
                // Something else happened while setting up the request
                console.error('Error:', error.message);
                alert('An error occurred during login. Please try again.');
            }           }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

// export default Login;





        export default App;





