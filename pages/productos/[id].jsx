import React, {useEffect, useContext, useState} from 'react';
import { useRouter } from 'next/router';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import styled from '@emotion/styled';

import {FirebaseContext} from '../../firebase';
import { doc, getDoc, updateDoc, deleteDoc} from "firebase/firestore";


const Titulo = styled.h1`
    text-align: center;
    margin-top: 5rem;
`;
const ContenedorProducto = styled.div`
    @media(min-width: 768px){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;
const Subtitulo = styled.h2`
    margin: 2rem 0;
`;
const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    // state del componente
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});
    const [consultarDB, guardarConsultarDB] = useState(true);

    // routing para obtener el id de la url
    const router = useRouter();
    const {query : {id}} = router;

    //context de firebase 
    const {firebase, usuario} = useContext(FirebaseContext);

    useEffect(() => {
        if (id && consultarDB) {
            const obtenerProducto = async() => {
                const producto = await getDoc( doc(firebase.db, "productos", id) );
                if(producto.exists()){
                    guardarProducto(producto.data());
                    guardarConsultarDB(false);
                }else{
                    guardarError(true);
                    guardarConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    },[id]);

    if (Object.keys(producto).length===0 && !error) return 'Cargando ....';

    const {comentarios, creado, descripcion, empresa, 
        nombre, url, urlimagen, votos, creador, haVotado} = producto;

    const votarProducto = () => {
        if (!usuario) {
            return router.push('/login');
        }

        //obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;   

        //verificar si el usuario actual ha votado
        if (haVotado.includes(usuario.uid)) {
            return;
        }

        //guardar el ID del suuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid];

        //actualizar la bd
        updateDoc( doc(firebase.db, "productos", id) , {
            votos : nuevoTotal, 
            haVotado: nuevoHaVotado
        });

        //actualizar el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        });

        guardarConsultarDB(true);
    }

    //funciones par acrear comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        });
    }

    const esCreador = id =>{
        if (creador.id == id) {
            return true;
        }
    }

    const agregarComentario = e =>{
        e.preventDefault();

        if(!usuario){
            return router.push('/login');
        }

        //informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //tomar copia de comentarios y agregarlos al arreglo
        const nuevosComentarios = [...comentarios, comentario];

        //actualizar la bd
        updateDoc( doc(firebase.db, "productos", id) , {
            comentarios: nuevosComentarios
        });


        //actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        guardarConsultarDB(true);
    }

    const puedeBorrar = () => {
        if(!usuario) return false;
        if(creador.id===usuario.uid) return true;
    }

    //eliminar un producto de la bd
    const eliminarProducto = async () =>{
        if(!usuario) return router.push('/login');
        if(creador.id!==usuario.uid) router.push('/');

        try {
            await deleteDoc(doc(firebase.db, "productos", id));
            router.push('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <>
            {error ? <Error404 /> : (
                <>
                <div className="contenedor">
                    <Titulo>{nombre}</Titulo>
                </div>
                <ContenedorProducto className="contenedor">
                    <div>
                        <p>Publicado hace : {formatDistanceToNow(new Date(creado), {locale: es})}</p>
                        <p>Por: {creador.nombre} de : {empresa}</p>
                        <img src={urlimagen} alt=""/>
                        <p>{descripcion}</p>

                        {usuario && (
                            <>
                            <h2>Agrega tu comentario</h2>
                            <form 
                            onSubmit={agregarComentario}
                            >
                                <Campo>
                                    <input type="text"
                                        name="mensaje"
                                        onChange={comentarioChange}
                                    />
                                </Campo>
                                <InputSubmit 
                                    type="submit"
                                    value="Agregar Comentario"
                                />
                            </form>

                            <Subtitulo>Comentarios</Subtitulo>
                            {comentarios.length === 0 ? 'aun no hay comentarios' : 
                                <ul>
                                    {comentarios.map((comentario, i) => (
                                        <li
                                            key={`${comentario.usuarioId}-${i}`}
                                            style={{border: '1px solid #e1e1e1', padding: '2rem'}}
                                        >
                                            <p>{comentario.mensaje}</p>
                                            <p>Escrito por :  
                                                <span style={{fontWeight: 'bold'}}> 
                                                    {' '} {comentario.usuarioNombre}
                                                </span>
                                            </p>
                                            {esCreador(comentario.usuarioId) && <CreadorProducto>Es creador</CreadorProducto>}
                                        </li>
                                    ))}
                                </ul>
                            }
                            </>
                        )}
                    </div>
                    <aside>
                        <Boton
                            target="_blank"
                            bgColor="#DA552F"
                            textColor="white"
                            href={url}
                        >Visitar URL</Boton>

                        
                                
                        <div style={{marginTop: '5rem'}}>
                            <p style={{textAlign: 'center'}}>Votos : {votos}</p>
                            {usuario &&  
                            <Boton 
                                onClick={votarProducto}
                            >Votar</Boton>}
                        </div>
                        
                    </aside>

                </ContenedorProducto>
                {puedeBorrar() && 
                    <Boton
                        bgColor="red"
                        textColor="white"
                        onClick={eliminarProducto}
                    >
                        Eliminar Producto
                    </Boton>
                }
                </>
            )}
            
            
            </>
        </Layout>
    );
}
 
export default Producto;