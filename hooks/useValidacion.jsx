import React, { useEffect, useState } from 'react';

const useValidacion = (stateInicial, validar, fn) => {

    const [valores, guardarValores] = useState(stateInicial);
    const [errores, guardarErrores] = useState({});
    const [submitForm, guardarSubmitForm] = useState(false);

    useEffect(() =>{
        if (submitForm) {
            const noErrores = Object.keys(errores).length === 0;
            if (noErrores) {
                fn(); // fn = funcion q se ejecuta en el componente
            }

            guardarSubmitForm(false);
        }
    },[errores]);

    // Funcion que se ejecuta conformo el usuario escribe algo
    const handleChange = e =>{ 
        guardarValores({
            ...valores,
            [e.target.name] : e.target.value
        });
    }

    // Funcion que se ejecuta cuando manda el formulario
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
        guardarSubmitForm(true);
    }

    //cuando se realiza el event blur
    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
    }

    return {
        valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur
    };
}
 
export default useValidacion;