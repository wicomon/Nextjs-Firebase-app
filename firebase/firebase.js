import { initializeApp } from "firebase/app";
// import app from 'firebase/compat/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import 'firebase/auth';
// import 'firebase/firestore';
import { getFirestore } from "firebase/firestore"
// import 'firebase/storage';
import { getStorage } from 'firebase/storage';
import firebaseConfig from './config';

class Firebase {
    constructor(){
        this.app = initializeApp(firebaseConfig);
        // if (!app.apps.length) {
        //     app.initializeApp(firebaseConfig);
        // }
        this.auth = getAuth();
        this.db = getFirestore();
        this.storage = getStorage(this.app);
    }

    //registrar un usuario
    async registrar(nombre, email, password){
        const nuevoUsuario = await createUserWithEmailAndPassword(this.auth, email, password);
        // nuevoUsuario.user.displayName = nombre;
        await updateProfile(nuevoUsuario.user, {displayName: nombre});
        return nuevoUsuario.user;
    };

    //iniciar sesion del usuario
    async login(email, password){
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    //cierra la sesion del usuario
    async cerrarSesion(){
        await signOut(this.auth);
    }


}

const firebase = new Firebase();

export default firebase;