# Proyecto de Entrevista para Desarrollador FullStack

## Instalación
1. Descarga el repositorio en tu computadora local y dirígete a su ruta.
2. Abre una consola e instala las dependencias del sistema
```sh
npm istall
```
3. Inicia el proyecto en React. Se abrirá una pestaña en tu computador utilizando el puerto 3000
```sh
npm start
```
4. En una consola aparte inicia la API Rest mediante JSON Server
```sh
json-server --watch db.json --port 3001
```
5. ¡Listo! Ya puedes navegar por el mini carro de compras.

Nota: Se asume que el lector tiene un conocimiento adecuado para seguir los pasos anteriores, así mismo cuenta con el dispositivo y las herramientas necesarias para ejecutar la App.


## Explicación del proyecto
Se solicita hacer un mini carro de compras utilizando los métodos típicos tipo CRUD.
Tecnologías a utilizar:
- [React](https://reactjs.org/docs/create-a-new-react-app.html)
- [JSON Server](https://github.com/typicode/json-server)

Se solicita hacer crear una aplicación en React y levantar una API Rest con Json Server, consumiendo un objeto tipo JSON desde la siguiente URL: [Cuponatic Testing Data](https://s3.amazonaws.com/cuponassets.cuponatic-latam.com/uploads/dev/db.json)

El proyecto debe contar con 2 páginas con URLs distintas y utilizando react-router-dom.
La primera página debe exponer los productos y la capacidad de agregarlos al carrito de compras.
La segunda página realiza un resumen de la compra

Se solicita la manipulación de los productos con objeto de poder ordenarlos por 4 criterios:
- Título
- Menor precio
- Mayor precio
- Mejor clasificación

Se solicita que los productos agregados al carro de compras sean persistentes, haciendo uso de LocalStorage

Se solicita hacer y validar un formulario de información de usuario con los campos:
- Nombre
- Email
- Teléfono

Por último se solicita la capacidad de poder enviar un Objeto por método POST a la API como se muestra a continuación:

```sh
{
    id: "1234567890%CarlosRojas%carlos@gmail.com",
    nombre: "Carlos Rojas",
    email: "carlos@gmail.com",
    teléfono: 912345678,
    total_a_pagar: 19900,
    productos: [
        {
          "id_descuento": "299942",
          "titulo": "Beatle Hombre 100% algodón Mora",
          "imagen": "https://cuponassets.cuponatic-latam.com/backendCl/uploads/imagenes_descuentos/99942/9df6da3616d2d0f996595fe473fb0ec735ada7ec.XL2.jpg",
          "valor_oferta": '$7.990',
          "valor_oferta_plano": 7990,
          "calificaciones": 7.93,
          "qty": 1,
        }
    ]
}
```
El objeto anterior debe ser persistido en la Base de Datos, esto se logra automáticamente mediante JSON Server.


## License

MIT