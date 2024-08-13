import React,{createContext,useContext,useState} from 'react';
const Rolecontext=createContext();

export const useRole = () => {
  return useContext(Rolecontext);
};


export const Roleprovider=({children})=>{

    const [roles,setroles]=useState([]);
    const haspermission=(permission)=>{
        return roles.includes(permission);
    };
    return (
        <Rolecontext.Provider value={{ roles, setroles, haspermission }}>
          {children}
        </Rolecontext.Provider>
      );


};