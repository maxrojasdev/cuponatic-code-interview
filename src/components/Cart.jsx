import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import * as EmailValidator from 'email-validator';
import Header from './Header';

export default function Cart() {
  const [userData, setUserData] = useState({ nombre: '', email: '', telefono: 0 })
  const [cartProducts, setCartProducts] = useState([])
  const [errorText, setErrorText] = useState(false)
  const [ordered, setOrdered] = useState(false)
  let totalPrice = 0

  useEffect(() => {
    setCartProducts(JSON.parse(localStorage.getItem("cart")))
    setOrdered(false)
    setErrorText(false)
  }, [])

  const handleInputChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value })
  }

  // Envía la orden de compra por POST a la API. Setea estados de error y éxito de compra
  const submitOrder = async (e) => {
    e.preventDefault()
    const date = new Date();
    // Generación de código/id único Hash solicitado en los requerimientos
    const hashId = `${date.getTime()}%${Math.random()}%${userData.nombre}%${userData.email}%${totalPrice}`
    const submitObject = {
      id: hashId,
      nombre: userData.nombre,
      email: userData.email,
      telefono: parseInt(userData.telefono),
      total_a_pagar: totalPrice,
      productos: cartProducts
    }

    // Prueba la validación para continuar con el método POST
    if (dataValidation(submitObject)) {
      fetch('http://localhost:3001/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitObject),
      })
        .then(response => response.json())
        .then(data => {
          setOrdered(true)
          setErrorText(false)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    else { setOrdered(false); setErrorText(true) }
  }

  // Validaciones: Que exista un nombre, correo formateado, teléfono solo números y al menos un producto en carro
  const dataValidation = (data) => {
    if (data.nombre.length <= 0) { return false }
    if (!EmailValidator.validate(data.email)) { return false }
    if (isNaN(data.telefono) || data.telefono === 0) { return false }
    if (data.productos <= 0) { return false }
    return true
  }

  return (
    <div className="d-flex flex-column" style={{ flex: 1 }}>
      <Header />
      {
        cartProducts.length > 0 ?
          <div className="m-4 p-2 border-r-4" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <div className="d-flex m-3">
              <div className="col-1 font-header1">#</div>
              <div className="col-5 font-header1">Producto</div>
              <div className="col-2 font-header1">Cantidad</div>
              <div className="col-2 font-header1">Precio</div>
              <div className="col-2 font-header1">Totales</div>
            </div>
            {
              cartProducts.map((cartProduct, key) => {
                totalPrice += cartProduct.valor_oferta_plano * cartProduct.qty
                return (
                  <div className="d-flex p-3 justify-content-center align-items-center" key={key}
                    style={{ background: key % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)' }}>
                    <div className="col-1">{key + 1}</div>
                    <div className="d-flex col-5 justify-content-center align-items-center">
                      <img className="col-5 card-img-top" style={{ maxWidth: '200px' }}
                        src={cartProduct.imagen}
                        alt={`${cartProduct.titulo}`} />
                      <div className="col-6">{cartProduct.titulo}</div>
                    </div>
                    <div className="col-2">{cartProduct.qty}</div>
                    <div className="col-2">{cartProduct.valor_oferta}</div>
                    <div className="col-2">${new Intl.NumberFormat().format(cartProduct.valor_oferta_plano * cartProduct.qty)}</div>
                  </div>
                )
              })
            }
            <div className="d-flex m-3">
              <div className="col-2 offset-md-8 font-header1">Total a pagar</div>
              <div className="col-2 font-header1">${new Intl.NumberFormat().format(totalPrice)}</div>
            </div>
          </div>
          :
          <div className="m-4 p-2 border-r-4" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
            <div className="font-header1 pt-4">Oh oh! Su carrito está vacío</div>
            <Link to="/"><button type="button" className="btn btn-info m-4 btn-lg">Ir de compras</button></Link>
          </div>
      }
      <div className="d-flex w-100 justify-content-center pb-4">
        <div className="d-flex p-4 border-r-4" style={{ background: 'rgba(255, 255, 255, 0.8)', marginBottom: '100px' }}>
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Nombre</label>
              <input className="form-control" onChange={handleInputChange} name="nombre" placeholder="Ingrese su nombre" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email</label>
              <input className="form-control" onChange={handleInputChange} name="email" placeholder="Ingrese su correo" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Teléfono</label>
              <input className="form-control" onChange={handleInputChange} name="telefono" placeholder="Ingrese su teléfono" />
            </div>
            <div className="d-flex">
              <Link to="/"><button type="button" className="btn btn-info m-4 btn-lg">Volver</button></Link>
              <button onClick={(e) => submitOrder(e)} type="submit" className="btn btn-success m-4 btn-lg ">Confirmar compra</button>
            </div>
            {
              (ordered && !errorText) ?
                <div className="font-purchase" >¡Gracias por su compra!</div>
                :
                errorText &&
                <div className="font-error" >Los campos introducidos no son válidos. <br />Por favor revise los datos.</div>
            }
          </form>
        </div>
      </div>
    </div>
  )
}
