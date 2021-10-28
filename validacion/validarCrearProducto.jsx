export default function validarCrearProducto(valores){
    let errores = {};

    //validar el nombre de usuario
    if (!valores.nombre) {
        errores.nombre = "el nombre es obligatorio";
    }
    if (!valores.empresa) {
        errores.empresa = "el nombre de empresa es obligatorio";
    }
    if (!valores.url) {
        errores.url = "el url es obligatorio";
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "URL no válida"
    }
    if (!valores.descripcion) {
        errores.descripcion = "Agrega una descripción a tu producto";
    }

    return errores;
}