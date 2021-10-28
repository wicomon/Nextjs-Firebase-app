import React,{useState, useContext} from 'react';
import Router, {useRouter} from 'next/router';
import Layout from '../components/layout/Layout';
import styled from '@emotion/styled';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import Error404 from '../components/layout/404';


import FileUploader from "react-firebase-file-uploader";
import {FirebaseContext} from '../firebase';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//validaciones 
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const Titulo = styled.h1`
    text-align: center;
    margin-top: 5rem;
`;

const STATE_INICAL = {
    nombre: '',
    empresa: '',
    // imagen: '',
    url: '',
    descripcion: ''
}



const NuevoProducto = () => {

    const [error, guardarError] = useState(false);

    //state de las imagenes
    const  [nombreimagen, guardarNombre] = useState('');
    const  [subiendo, guardarSubiendo] = useState(false);
    const  [progreso, guardarProgreso] = useState(0);
    // const  [urlimagen, guardarUrlImagen] = useState('');
    const [selectedFile, setSelectedFile] = useState(false);
    let urlimagen;

    const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICAL,validarCrearProducto, crearProducto);

    const {nombre, empresa, imagen, descripcion, url} = valores;

    //hook de routing para redireccionar
    const router = useRouter();
    
    //context con las opreaciones crud de firebase
    const { usuario, firebase } = useContext(FirebaseContext);

    const imagesRef = ref(firebase.storage, 'productos/');

    const onImagenChange= (event) => {
		setSelectedFile(event.target.files[0]);
	};

    async function crearProducto(){
        if (!usuario) {
            return router.push('/login');
        }

        if (selectedFile) await submirImagen();
        
        // console.log(urlimagen);
        //crear el objeto de nuevo producto
        const producto = {
            nombre,
            empresa,
            url,
            urlimagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador : {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado : []
        }
        
        
        //insertarlo en la base de datos
        // await firebase.db.collection('productoss').add(producto);
        await addDoc(collection(firebase.db, 'productos'), producto);

        return router.push('/');
    }

    const submirImagen = async () =>{
        // const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+selectedFile.name ;
        const random = Date.parse(new Date()) + Math.random().toString(36).substring(2, 15);
        const storageRef = ref(firebase.storage, 'productos/' + random);
        const imgSubida = await uploadBytesResumable(storageRef, selectedFile, {contentType: 'image/jpeg'})
        const urlImagen = await getDownloadURL(imgSubida.ref);
        // console.log('url : ', urlImagen);
        urlimagen = urlImagen;
    }

    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    }

    const handleProgress = progreso => guardarProgreso({progreso});

    const handleUploadError = error =>{
        guardarSubiendo(error);
        console.error(error);
    }

    const handleUploadSuccess = nombre => {
        guardarProgreso(100);
        guardarSubiendo(false);
        guardarNombre(nombre)
        // firebase
        //     .storage
        //     .ref("productos")
        //     .child(nombre)
        //     .getDownloadURL()
        //     .then(url => {
        //         console.log(url);
        //         guardarUrlImagen(url);
        //     });
        // const storageRef = ref(firebase.storage, 'productos/' + nombre);
        // getDownloadURL(storageRef).then((url) => {
        //     console.log('File available at', url);
        //     guardarUrlImagen(url);
        // });
    }


    return (
        <div>
            <Layout>
                {!usuario ? <Error404 /> :
                <>
                <Titulo>Nuevo Producto</Titulo>
                <Formulario onSubmit={handleSubmit} noValidate>

                <fieldset>
                    <legend>
                        Información General
                    </legend>
                    
                <Campo>
                        <label htmlFor="nombre">Nombre</label>
                        <input 
                            type="text"
                            id="nombre"
                            placeholder="Tu nombre"
                            name="nombre"
                            value={nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.nombre && <Error>{errores.nombre}</Error>}

                    <Campo>
                        <label htmlFor="empresa">Empresa</label>
                        <input 
                            type="text"
                            id="empresa"
                            placeholder="Tu Empresa"
                            name="empresa"
                            value={empresa}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.empresa && <Error>{errores.empresa}</Error>}

                    <Campo>
                        <label htmlFor="imagen">imagen</label>
                        <input 
                            // accept="image/*"
                            type="file"
                            id="imagen"
                            name="imagen"
                            required
                            onChange={onImagenChange}
                            // randomizeFilename
                            // storageRef={ref(firebase.storage, 'productos/')}
                            // onUploadStart={handleUploadStart}
                            // onUploadError={handleUploadError}
                            // onUploadSuccess={handleUploadSuccess}
                            // onProgress={handleProgress}
                        />
                    </Campo>

                    <Campo>
                        <label htmlFor="url">url</label>
                        <input 
                            type="text"
                            id="url"
                            name="url"
                            placeholder="URL de tu producto"
                            value={url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.url && <Error>{errores.url}</Error>}
                </fieldset>

                <fieldset>
                    <legend>Sobre tu producto</legend>

                    <Campo>
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea 
                            id="descripcion"
                            name="descripcion"
                            value={descripcion}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.descripcion && <Error>{errores.descripcion}</Error>}

                </fieldset>
                    
                    {error && <Error>{error}</Error>}
                    <InputSubmit 
                        type="submit"
                        value="Crear Producto"
                    />
                </Formulario>
                </>
            }
            </Layout>
        </div>
    );
}
 
export default NuevoProducto;