import React,{useState} from 'react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import styled from '@emotion/styled';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import firebase from '../firebase';

//validaciones 
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const Titulo = styled.h1`
    text-align: center;
    margin-top: 5rem;
`;

const STATE_INICAL = {
    email: '',
    password: ''
}

const Login = () => {
    const [error, guardarError] = useState(false);

    const {valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICAL,validarIniciarSesion, inicarSesion);

    const { email, password} = valores;

    async function inicarSesion(){
        try {
            const usuario = await firebase.login(email, password);
            // console.log(usuario);
            Router.push('/');

        } catch (error) {
            console.log('Hubo un error al autenticar', error.message);
            guardarError(error.message);
        }
    }

    return (
        <div>
            <Layout>
                <>
                <Titulo>Iniciar Sesión</Titulo>
                <Formulario onSubmit={handleSubmit} noValidate>
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
                        value="Iniciar Sesión"
                    />
                </Formulario>
                </>
            </Layout>
        </div>
    );
}
 
export default Login;