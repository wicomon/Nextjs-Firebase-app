import React, {useState, useEffect} from 'react';
// import firebase from '../firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function useAutenticacion(){
    const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null);

    const auth = getAuth();

    useEffect(()=>{
        // const unsuscribe = firebase.auth.onAuthStateChanged(usuario =>{
        //     if (usuario) {
        //         guardarUsuarioAutenticado(usuario);
        //     }else{
        //         guardarUsuarioAutenticado(null);
        //     }
        // });

        const unsuscribe = onAuthStateChanged(auth, (usuario) =>{
            if (usuario) {
                guardarUsuarioAutenticado(usuario);
            }else{
                guardarUsuarioAutenticado(null);
            }
        });


        return()=>unsuscribe();
        
    }, []);

    return usuarioAutenticado;
}
export default useAutenticacion;