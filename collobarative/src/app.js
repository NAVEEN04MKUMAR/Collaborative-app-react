
import React,{useState,useEffect,useRef} from 'react';
import {BrowserRouter as Router,Route,Routes, useParams} from 'react-router-dom';
import axios from 'axios';
import {io} from 'socket.io-client';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {  TextOperation } from 'ot';
import Handsontable from 'handsontable';
import {HotTable} from '@handsontable/react';
import { response } from 'express';
import 'handsontable/dist/handsontable.full.css';
// import 'whatwg-fetch';


// import {Documenteditor} from './Document_editor';
// import {Roleprovider} from './Rolecontext';


const socket=io('http://localhost:5000');

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


// function transform(op1,op2){
//     return TextOperation.transform(op1,op2);
// }


// Event listener for connection disconnections
socket.on('disconnect', (reason) => {
    console.log('Disconnected from server:', reason);
});

const App=()=>{



return(
        <Router>
            <Routes> 
                {/* <Route path="/signup" element={<SignupForm/>}/>
               <Route path="/texteditor" element={<Texteditor/>}/> */}
              
               {/* <Route path="/create" element={<Createdoument/>}/>
               <Route path="/documents/:id/history" element={<Documenthistory/>}/>
               <Route path="/document" element={<Document/>}/>
               <Route path="/update/:id" element={<Updatedoument/>}/> */}

<Route path="/sheet" element={<Spreadsheet/>}/> 


               {/* <Route path="/documenteditor" element={<Documenteditor/>}/> */}
        {/* //         <Route path="/login" element={<Login/>}/>
        //         <Route path="/login1" element={<Login1/>}/>
        //         <Route path="/Protected" element={<Protected/>}/>
        //         <Route path="/editor" element={<Collaborativeeditor/>}/>  
        //         <Route path="/realtime" element={<Realtimecomponent/>}/>
        //         <Route path="/roleprovider" element={< Roleprovider/>}/>     */}
                 {/* <Route path="/signup"  element={<SignupForm/ >}/> */}
             </Routes>
         </Router>

    );
 };



//  const Notificationsystem=()=>{
//     const [notification,setnotification]=useState([]);

//     useEffect(()=>{

//         socket.on('receive-notification',(notification)=>{
//             setnotification((prevnotifications)=>[notification,...prevnotifications]);
//         });

//         return ()=>{
//             socket.off('receive-notification');
//         }
//     },[]);

//     return(
//         <div>
//             <h3>
//                 Notifications
//             </h3>
//             {/* <ul>
//                 {notification.map(()=>(
//                     <li key={index}>
//                         {notification.message}
//                     </li>
//                 ))}
//             </ul> */}
//         </div>
//     );
//  };

const Spreadsheet=()=>{
    const [data,setdata]=useState([
        ['','A','B','C'],
        ['1','','',''],
        ['2','','',''],
        ['3','','',''],
    ]);
    useEffect(()=>{
        fetch('http://localhost:5000/spreadsheet')
        .then((data)=>{
            if(data&&data.data){
                setdata(data.data);
            }
        })
        .catch((error)=>{
            console.error('error fetching spreadsheet data',error);
        });
        socket.on('cell-update',(updatedata)=>{
            setdata(updatedata);
        });
    },[]);

    const handlechange4=(changes)=>{
        const updatedata=[...data];
        changes.forEach(([row,col,oldval,newval])=>{
            updatedata[row][col]=newval;
        });
        setdata(updatedata);
        socket.emit('update-cell',updatedata);

        fetch('http://localhost:5000/spreadsheet',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: updatedata }),
        })
        .then((data)=>{
            console.log('spreadsheet',data);
        })
        .catch((error)=>{
            console.error('error saving spreadsheet data',error);
        })
    }
    return(
        <HotTable
        data={data}
        colHeaders={true}
        rowHeaders={true}
        contextMenu={true}
        afterChange={handlechange4}
        />
    )
}
































// const Signup=()=>{
//     const [username,setusername]=useState('');
//     const [password,setpassword]=useState('');
//     const [role, setrole] = useState('user');

// const handlesignup=async()=>{

//     const response=await axios.post('/signup',{username,password});
//     localStorage.setItem('role',response.data.role)
//     alert('usercreated');
// };

//     return(
//     <div>
//         <h1>Signup</h1>
//         <input 
//         type="text"
//         placeholder="username"
//         value={username}
//         onChange={(e)=>setusername(e.target.value)}
//         />
//         <input 
//         type="password"
//         placeholder="password"
//         value={password}
//         onChange={(e)=>setpassword(e.target.value)}
//         />
//        <button onClick={handlesignup}>Signup</button>
//     </div>
//     );
// };

// const Login=()=>{
//     const [username,setusername]=useState('');
//     const [password,setpassword]=useState('');
//     const [token,settoken]=useState(localStorage.getItem('token'||''));


// const handlelogin=async()=>{
//    const response=await axios.post('/login',{username,password});
//    settoken(response.data.token);
//    localStorage.setItem('token',response.data.token);
//    localStorage.setItem('role',response.data.role);

// };

//     return(
//     <div>
//         <h1>Login</h1>
//         <input 
//         type="text"
//         placeholder="username"
//         value={username}
//         onChange={(e)=>setusername(e.target.value)}
//         />
//         <input 
//         type="text"
//         placeholder="password"
//         value={password}
//         onChange={(e)=>setpassword(e.target.value)}
//         />
//        <button onClick={handlelogin}>Login</button>
//     </div>
//     );
// };

// const Login1=()=>{
//     const handlegooglelogin=()=>{
//         // useEffect(()=>{
//             window.location.href='http://localhost:5002/auth/google';
//         //},[]);
//     };
//     return(
//         <div>
//             <h1>Login</h1>
//             <button onClick={handlegooglelogin}>login with google</button>
//         </div>
//     );
// };

// const Protected=()=>{
//     const [user,setuser]=useState(null);
//     useEffect(()=>{
//         const token=new URLSearchParams(window.location.search).get('token');
//         if(token){
//             localStorage.setitem('token',token);
//             axios.get('/protected',{
//                 headers:{
//                     'Authorization':token
//                 }
//             }).then(response=>{
//                 setuser(response.data);
//             }).catch(error=>{
//                 console.error('error fetching protected route',error);
//             });
//         }
//     },[]);
//     return user?<h1>Welcome,{user.name}</h1>:<h1>Loading...</h1>
// };


// const Realtimecomponent=()=>{
//     const [messages,setmessages]=useState([]);

//     useEffect(()=>{
//         socket.on('message',(data)=>{
//             setmessages((prevmessages)=>[...prevmessages,data]);
//     });
//     return ()=>{
//         socket.disconnect();
//     }
//     },[]);

//     const sendmessage=()=>{
//         const message="hello from client";
//         socket.emit('message',message);
//     };

//     return(
//         <div>
//             <h1>Real time updates</h1>
//             <button onClick={sendmessage}>Send message</button>
//             <ul>
//                 {messages.map((msg,index)=>(
//                     <li key ={index}>{msg}</li>
//                 ))}
//             </ul>
//         </div>
//     )



// }

// //it listen load text and update text events to synchromize the text across all connected client
// //whatever changes we make then it will store the changes to the server
// const Collaborativeeditor=()=>{
//     const [text,settext]=useState('');

// //listen for updates fro   the clients
//     useEffect(()=>{

//     //load the inital text from server
//     socket.on('load-text',(initialtext)=>{
//         settext(initialtext);
//     });
    

//     socket.on('update-text',(newtext)=>{
//             settext(newtext);
//         });

    
//       return()=>{
//             socket.off('load-text');
//             socket.off('update-text');
//         };
        
//     },[]);

//     const handlechange=(e)=>{
//         const newtext=e.target.value;
//         settext(newtext);
//         socket.emit('update-text',newtext);//send the update text to the server
//     }

//     return (
//         <div>
//             <h1>Collaborative text editor</h1>
//                     <textarea 
//         value={text}
//         onChange={handlechange}
//         rowa="10"
//         cols="30"
//         />
//         </div>
//     )
// };


// const SignupForm = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('user'); // Default role
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
  
//       const userData = { username, password, role };
  
//       try {
//         const response = await axios.post('http://localhost:5000/signup', userData);
//         alert(response.data);
//       } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred while creating the user.');
//       }
//     };
  
//     return (
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Username:</label>
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <div>
//           <label>Role:</label>
//           <select value={role} onChange={(e) => setRole(e.target.value)} required>
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>
//         <button type="submit">Sign Up</button>
//       </form>
//     );
//   };
  



// const Texteditor=({})=>{
//     const quillRef = useRef(null); 
//      const [editorid,seteditorid]=useState('');
      
//     //listen for incoming deltas from server
//       useEffect(()=>{

//         // Set up socket connection and get socket.id
//         socket.on('connect', () => {
//             seteditorid(socket.id);
//             console.log('Editor ID:', socket.id); // Log the editor ID
//         });

//       if(quillRef.current){
//         console.log('Initializing Quill editor...');

//         const quill = new Quill(quillRef.current, {
//             theme: 'snow', // or 'bubble'
//             modules: {
//               toolbar: true, // Show toolbar with basic editing options
//             },
//         });

//         console.log('Quill initialized:', quill);

//         socket.on('receive-initial-text', ({ text }) => {
//             console.log('Received initial text:', text);
//             quill.setContents([{ insert: text  }]);
//             console.log('Current editor content after setContents:', quill.getContents());

//             // if(quillRef.current){
//             //     quillRef.current.getEditor().setContents([{ insert: text }]);
//             //   }
//             });
        
//  // Apply incoming deltas
//      socket.on('receive-delta', ({ delta, senderid }) => {
//         console.log('Delta received from', senderid);
//         console.log('Applying delta:', delta);
//  // Ensure the Quill instance is ready before applying the delta
//  if (quill) {
//     quill.updateContents(delta);

//     // Log the current content after applying the delta
//     console.log('Current editor content after updateContents:', quill.getContents());
// } else {
//     console.log('Quill instance is not initialized.');
// }         // Log the current content after setting it
//        });
      
//        quill.on('text-change', (delta, oldDelta, source) => {
//         console.log('Text-change event detected:', delta, source);
//         // Log the source and editorid to ensure they are as expected
//     console.log('Source:', source);
//     console.log('Editor ID:', editorid);
//         //changes send to the server
//         if(source === 'user' && editorid){
//             console.log('Condition met, preparing to send delta.');
//             console.log('Sending delta to server:', delta);
//             socket.emit('send-delta', { delta, senderid: editorid });
//             // console.log('send data from :',senderid);
//             console.log('Delta sent to server.');
//         }else{
//             console.log('Condition not met. Source:', source, 'Editor ID:', editorid);
//         }
//     });

//         // Clean up the listener on component unmount
//         return () => {
//             socket.off('receive-initial-text');
//             socket.off('receive-delta');
            
//         };
//       }else{
//       console.log('Quill editor ref is null, waiting for DOM to be ready...');
//       }

//     },[editorid]);
    

//     return (
//         <div>
//             <div ref={quillRef}></div>
//         </div>
//     )



// }

    // const handlechange1=(content,delta,source)=>{
    //     seteditorcontent(content);

    //     // console.log('delta content',source);
    //     // console.log('editor content',content);
    //     // console.log('delta content',delta);
       
    // }    //   export default SignupForm;

//     function applyoperation(op){
//     if(quillRef.current){
//       const delta=convertottodelta(op);
//       quillRef.current.getEditor().updateContents(delta);
//     }
//   }
//   function convertottodelta(op){
//     return {
//         ops:[{insert:op.text,retain:op.retain}]
//     }
// }

{/* <ReactQuill value={editorcontent} 
onChange={handlechange1}/>
 */}






















 
//  const Createdoument=()=>{
//     const [tittle,settittle]=useState('');
//     const [content,setcontent]=useState('');
//     const [author,setauthor]=useState('');
    
//     const handlechange2=async(e)=>{

//         const documentdata={
//             tittle:tittle,
//             content:content,
//             author:author
//         };

//         try{
//             const response=await axios.post('http://localhost:5000/documents/create',documentdata);
//             console.log('document created',response.data)

//         }
//         catch(error){
//             console.error('error creating document',error.response?error.response.data:error.message)

//         }
//     }
//     return (
//         <form onSubmit={handlechange2}>
//             <div>
//                 <label>Tittle:</label>
//                 <input type="text" value={tittle} onChange={(e)=>settittle(e.target.value)}/>
//             </div>

//             <div>
//                 <label>Content:</label>
//                 <textarea value={content} onChange={(e)=>setcontent(e.target.value)}/>
//             </div>

//             <div>
//                 <label>Author:</label>
//                 <input type="text" value={author} onChange={(e)=>setauthor(e.target.value)}/>
//             </div>
// <button type="submit">create the document</button>
//         </form>
//     );

    

//  };

//  const Updatedoument=()=>{
//     const {id}=useParams();
//     const [document,setdocument]=useState(null);
//     const [newcontent,setnewcontent]=useState('');
//     const [author,setauthor]=useState('');
    
//     useEffect(()=>{
//     const fetchdocument=async()=>{
//         try{
//             const response=await axios.get(`http://localhost:5000/documents/${id}`);
//             setdocument(response.data.document);
//             setnewcontent(response.data.document.content);

//         }
//         catch(error){
//             console.error('error creating document',error.response?error.response.data:error.message)

//         }
//     }
//     fetchdocument();
//     },[id]);



//     useEffect(()=>{
//         socket.on('document-updated',(notification)=>{
//             console.log('document updated notification',notification);
//         })
//         // Cleanup on component unmount
//         return () => {
//             socket.off('document-updated');
//         };

//     },[]);

//     const handlechange3=async(e)=>{
//         const updatedata={
//             newcontent:newcontent,
//             author:author,
//         };

//         try{
//             const response=await axios.post(`http://localhost:5000/documents/${id}/update`,updatedata);
//             console.log('document updated',response.data.message)
//         }
//         catch(error){
//             console.error('error updating document',error.response?error.response.data:error.message)

//         }
//     }

//     if (!document) return <p>Loading...</p>;



//     return (
//         <div>
//             <h1>Update document</h1>
//         <form onSubmit={handlechange3}>
//             <div>
//                 <label>Tittle:</label>
//                 <input type="text" value={document.tittle}/>
//             </div>

//             <div>
//                 <label>Content:</label>
//                 <textarea value={newcontent}
//                 onChange={(e)=>setnewcontent(e.target.value)}
//                 required
//                 />
//             </div>

//             <div>
//                 <label>Author:</label>
//                 <input 
//                 type="text" 
//                 value={author} 
//                 onChange={(e)=>setauthor(e.target.value)}
//                 required/>
//             </div>
// <button type="submit">Updatedoument</button>
//         </form>
//         </div>
//     );

// }
// function Documenthistory({}){
//       const { id } = useParams();
//     console.log('inside the document history');
//      const [versions,setversions]=useState([]);
     
//      useEffect(()=>{
//         const fetchhistory=async()=>{
//             console.log(`Fetching history for document ID: ${id}`);
//          try{
//             const response = await axios.get(`http://localhost:5000/documents/${id}/history`);
//             // Axios automatically parses the response as JSON
//             console.log('Document history data:', response.data);
//             setversions(response.data);     
//            }catch(error){
//             console.error('Error fetching document history:', error.response ? error.response.data : error.message);
//              alert('Failed to fetch document history.');
    
//         }
//         };
//         fetchhistory();
//     },[id]);
    

// const handlerevert=async(versionnumber)=>{
//     // try{
//         console.log(`Reverting document ${id} to version ${versionnumber}`);
//         const response=await axios.post(`http://localhost:5000/documents/${id}/revert`,{
//             versionnumber:versionnumber
//         });
//         // const data=await response.json();
//         console.log('Revert document response:', response.data);
//         if (response.status === 200) {
//             alert(`Document successfully reverted to version ${versionnumber}`);
//         } else {
//             alert(`Failed to revert document: ${response.data.message}`);
//         }
// }


//     return (
//         <div>
//             <h2>Document version history</h2>
//           {versions.length>0?(
//              <ul>
//             {versions.map((version,index)=>(
//                 <li key={index}>
//                     version {index+1}:{JSON.stringify(version)}
//                 <strong>Version{version.versionnumber}</strong>
//                 <p>Content: {version.content}</p>
//                 <p>Edit by:{version.author}</p>
//                 <p>Timestamp:{new Date(version.timestamp).toLocaleString()}</p>
//                 <button onClick={()=>handlerevert(version.versionnumber)}>
//                 Revert Document
//                 </button>
//                 </li>
//         ))}
//         </ul>
//     ):(
//     <p>No history available</p>
//     )}
         
//         </div>
//       );
    
// }
// //Teams working on a document can highlight portions that need discussion or clarification and leave comments 
// //for teammates to review.Teams working on a document can highlight portions that need discussion or clarification and leave comments 
// //for teammates to review.
// const Commentmodal=({selectedtext,onSubmit})=>{
//     const [comment,setcomment]=useState('');

 
//     const handlesubmit=()=>{
//         onSubmit(comment);
//         setcomment('');//clear the input after submit
//     };
 
//      return (
//          <div className="comment-modal">
//             <h3>add a comment</h3>
//             <p>selected text:{selectedtext}</p>
//             <textarea
//             value={comment}
//             onChange={(e)=>setcomment(e.target.value)}
//             placeholder='add your comment'/>
//             <button onClick={handlesubmit}>Submit</button>
//          </div>
//        );
    
//      };

// const Document=()=>{
//    const [selectedtext,setselectedtext]=useState('');
//    const [showmodel,setshowmodel]=useState(false);
//    const [comments,setcomments]=useState([]);
//    const [documentcontent,setdocumentcontent]=useState('');
//     const documentid='66cad6775a571e8fdd67b69d';


//    const fetchedocument=async()=>{
//     try{
//         const response=await axios.get(`http://localhost:5000/documents/${documentid}`);
//         setdocumentcontent(response.data.content);
//     }catch(error){
//         if (error.response) {
//             // The request was made and the server responded with a status code that falls out of the range of 2xx
//             console.error('Error data:', error.response.data);
//             console.error('Error status:', error.response.status);
//             console.error('Error headers:', error.response.headers);
//         } else if (error.request) {
//             // The request was made but no response was received
//             console.error('No response received:', error.request);
//         } else {
//             // Something happened in setting up the request that triggered an error
//             console.error('Error message:', error.message);
//         }
//         console.error('Config:', error.config);  // This logs the request config    }
// }
// }

//    useEffect(()=>{
//     fetchedocument();

// socket.on('comment-added',(data)=>{
//     if(data.documentid===documentid){
//         setcomments((prevcomments)=>[prevcomments,data]);
//         alert(`new comment is added on "${data.selectedtext}":${data.text}`)
//     }
// });

// return()=>{
//     socket.off('comment-added');
// };
//    },[documentid]);


//    const handletextselect=()=>{
//     const selectedtext=window.getSelection().toString();
//     if(selectedtext.trim()){
//         setselectedtext(selectedtext);
//         setshowmodel(true);//when we select the text it should show
//     }
//    };

//    const handlecommentsubmit=async(comment)=>{
//     console.log(`Comment submitted: ${comment}`);
//     console.log(`Selected Text: ${selectedtext}`);
//     console.log(`Document ID: ${documentid}`);
// try{
//     const response=await axios.post('http://localhost:5000/comments',{
//         documentid: documentid,
//         selectedtext: selectedtext,
//         text: comment,
// });
// if (response.data) {
//     setcomments([...comments, response.data]);
//     console.log(`Comment successfully submitted: ${response.data.text}`);
// } else {
//     console.error('No data received from the server.');
// }}catch(error){
//     if (error.response) {
//         console.error('Error data:', error.response.data);
//         console.error('Error status:', error.response.status);
//         console.error('Error headers:', error.response.headers);
//     } else if (error.request) {
//         console.error('No response received:', error.request);
//     } else {
//         console.error('Error message:', error.message);
//     }
//     console.error('Config:', error.config);}
//     setshowmodel(false);
//    }




//     return (
//         <div onMouseUp={handletextselect}>
//             <p>{documentcontent}</p>
            
//               <div>
//                 {comments.map((comment)=>(
//                     <div key={comment.id}>
//                     <p>
//                         <strong>
//                             {comment.selectedtext}
//                         </strong>:{comment.comment}
//                     </p>    
//                     </div> 
 

//                  ))} 
//             </div> 
             
//             {showmodel&&(
//                 <Commentmodal
//                 selectedtext={selectedtext}
//                 onSubmit={handlecommentsubmit}
//                 />
//             )}
//         </div>
//       );
    


//     };

export default App;





