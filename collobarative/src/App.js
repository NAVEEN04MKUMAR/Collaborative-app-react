
import React,{useState,useEffect} from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import axios from 'axios';
import {io} from 'socket.io-client';

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
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/login1" element={<Login1/>}/>
                <Route path="/Protected" element={<Protected/>}/>
                <Route path="/editor" element={<Collaborativeeditor/>}/>  
                <Route path="/realtime" element={<Realtimecomponent/>}/>
                
                <Route from="/"  to="/login"/>
            </Routes>
        </Router>
    );
};

const Signup=()=>{
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');

const handlesignup=async()=>{

    const response=await axios.post('/signup',{username,password});
    localStorage.setItem('role',response.data.role)
    alert('usercreated');
};

    return(
    <div>
        <h1>Signup</h1>
        <input 
        type="text"
        placeholder="username"
        value={username}
        onChange={(e)=>setusername(e.target.value)}
        />
        <input 
        type="password"
        placeholder="password"
        value={password}
        onChange={(e)=>setpassword(e.target.value)}
        />
       <button onClick={handlesignup}>Signup</button>
    </div>
    );
};

const Login=()=>{
    const [username,setusername]=useState('');
    const [password,setpassword]=useState('');
    const [token,settoken]=useState(localStorage.getItem('token'||''));


const handlelogin=async()=>{
   const response=await axios.post('/login',{username,password});
   settoken(response.data.token);
   localStorage.setItem('token',response.data.token);
   localStorage.setItem('role',response.data.role);

};

    return(
    <div>
        <h1>Login</h1>
        <input 
        type="text"
        placeholder="username"
        value={username}
        onChange={(e)=>setusername(e.target.value)}
        />
        <input 
        type="text"
        placeholder="password"
        value={password}
        onChange={(e)=>setpassword(e.target.value)}
        />
       <button onClick={handlelogin}>Login</button>
    </div>
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
        export default App;





