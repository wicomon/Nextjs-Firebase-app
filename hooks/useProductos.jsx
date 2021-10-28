import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../firebase";
import { query, collection, getDocs, orderBy } from "firebase/firestore";

const useProductos = (orden) => {
  const [productos, guardarProductos] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = async () => {
      // const snapshot = await getDocs(collection(firebase.db, "productos"), orderBy('creado','desc'));
      // manejarSnapshot(snapshot);

      // const productosRef = collection(firebase.db, "productos");
      // const q = query(productosRef, orderBy('creado','desc'));
      // const snapshot = await getDocs( q );
      const snapshot = await getDocs(
        query(collection(firebase.db, "productos"), orderBy(orden, "desc"))
      );
      manejarSnapshot(snapshot);
    };
    obtenerProductos();
  }, []);

  function manejarSnapshot(snapshot) {
    const productos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    guardarProductos(productos);
    // console.log(productos);
  }

  return {
    productos
  };
};

export default useProductos;
