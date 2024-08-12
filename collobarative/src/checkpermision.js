const Adminpanel=()=>{
    <div>Admin feature</div>
};

const Editorpanel=()=>{
    <div>Editor feature</div>
};

const Userdashboard=({user})=>{
    return (
        <div>
            {user.roles.include('admin')&&<Adminpanel/>}
            {user.roles.include('editor')&&<Editorpanel/>}
        </div>

    )
};

const deletebutton=({user})=>{
   <button diabled={!user.permission.includes('delete')}>
    Delete
   </button>
};

const Protectedroute=({component:Component,...rest})=>{
    <Route {...rest}
           render={props=>
           (rest.requiredrole)?(
            <Component {...props}/>
           ):(
            <Redirect to="/forbidden"/>
           )
           }
           />

};