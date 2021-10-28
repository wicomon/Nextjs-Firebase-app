import Layout from "../components/layout/Layout";
import styled from '@emotion/styled';
import Router from "next/router";
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import firebase from "../firebase";


//validaciones 
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';
import { useState } from "react";


const Titulo = styled.h1`
    text-align: center;
    margin-top: 5rem;
`;

const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
}

const CrearCuenta = () => {

    const [error, guardarError] = useState(false);

    const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL,validarCrearCuenta, crearCuenta);

    const {nombre, email, password} = valores;

    async function crearCuenta() {
        try {
            const rpta = await firebase.registrar(nombre, email, password);
            // console.log(rpta);
            Router.push('/');
        } catch (error) {
            const firebaseErrors = {
                'Firebase: Error (auth/email-already-in-use).': 'El email ingresado ya existe',
            };
            console.log(error.message);
            guardarError(firebaseErrors[error.message]);
        }
    }

    return (
        <div>
            <Layout>
                <>
                <Titulo>CrearCuenta</Titulo>
                <Formulario 
                    onSubmit={handleSubmit} 
                    noValidate
                >
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
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id="email"
                            placeholder="Tu email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.email && <Error>{errores.email}</Error>}
                    <Campo>
                        <label htmlFor="nombre">Password</label>
                        <input 
                            type="password"
                            id="password"
                            placeholder="Tu password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.password && <Error>{errores.password}</Error>}

                    {error && <Error>{error}</Error>}
                    <InputSubmit 
                        type="submit"
                        value="Crear Cuenta"
                    />
                </Formulario>
                </>
            </Layout>
        </div>
    );
};

export default CrearCuenta;
