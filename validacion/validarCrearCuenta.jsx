export default function validarCrearCuenta(valores){
    let errores = {};

    //validar el nombre de usuario
    if (!valores.nombre) {
        errores.nombre = "el nombre es obligatorio";
    }

    //validar email
    if (!valores.email) {
        errores.email = "el email es obligatorio";
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email="email no valido"
    }

    //validar el password
    if (!valores.password) {
        errores.password = "el password es obligatorio";
    }else if(valores.password.length < 6){
        errores.password = 'el password debe ser almenos de 6 caracteres'
    }

    return errores;
}