import React, { useContext } from 'react';
import Buscar from '../ui/Buscar';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Navegacion from './Navegacion';
import Boton from '../ui/Boton';
import {FirebaseContext} from '../../firebase';


const ContenedorHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width: 768px){
        display: flex;
        justify-content: space-between;
    }
`;

const MainHeader = styled.div`
    border-bottom: 2px solid var(--gris3);
    padding: 1rem 0;
`;

const Logo = styled.p`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
    cursor: pointer;
`;

const Izquierda = styled.div`
    display: flex;
    align-items: center;
`;

const Derecha = styled.div`
    display: flex;
    align-items: center;
`;

const Texto = styled.p`
    margin-right: 2rem;
`;

const Header = () => {

    const {usuario, firebase} = useContext(FirebaseContext);

    return (
        <header
            css={css`
                border-bottom: 2px solid var(--gris3);
                padding: 1rem 0;
            `}
        >
            <ContenedorHeader>
                <Derecha>
                <Link href="/"><Logo>P</Logo></Link>

                    <Buscar />

                    <Navegacion />

                </Derecha>
                <Izquierda>
                {usuario ? (
                    <>
                    <Texto>Hola : {usuario.displayName}</Texto>

                    <Boton 
                        bgColor="#DA552F"
                        textColor="white"
                        onClick={() => firebase.cerrarSesion()}
                    >Cerrar Sesión</Boton>
                    </>
                ) : (
                    <>
                    <Link href="/login">
                        <Boton
                            bgColor="#DA552F"
                            textColor="white"
                        >Login</Boton>
                    </Link>
                    <Link href="/crear-cuenta">
                        <Boton
                        >Crear Cuenta</Boton>
                    </Link>
                    </>
                )}
                </Izquierda>
            </ContenedorHeader>
        </header>
    );
}
 
export default Header;
