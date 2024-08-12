
import React from 'react';
import {Route,Navigate,Outlet,outlet} from 'react-router-dom';


const PrivateRoute=({component: Component,roles,...rest})=>{
    const token=localStorage.getItem('token');
    const userrole=localstorage.getitem('role');
    return (
        <Route
        {...rest}
        render={(props)=>
        token&&roles.includes(userrole)?(
        <Component {...props}/>
              ):(
              <Navigate to="/login"/>
            )
        }
            />
        )
        };
        export default PrivateRoute;

        
// const Protected=()=>{
//     return <h1>This is a private route</h1>;
// };