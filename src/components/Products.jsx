import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Logo from '../.assets/logo-cuponatic.jpeg'
import Header from './Header';

export default function Products() {
  const [welcome, setWelcome] = useState(true)
  const [sortByTitle, setSortByTitle] = useState('Título')
  const [sortBy, setSortBy] = useState('titulo')
  const [orderBy, setOrderBy] = useState('asc')
  const [products, setProducts] = useState([])
  const [cartProducts, setCartProducts] = useState([])
  const [pageNumbers, setPageNumbers] = useState([])
  const [pagination, setPagination] = useState(0)
  const itemsByPage = 9

  useEffect(() => {
    let paginationArray = [];
    const fetchData = async () => {
      fetch(`http://localhost:3001/productos`)
        .then(response => response.json())
        .then(data => {
          // Se está obtiene la cantidad de páginas para hacer la paginación
          for (let i = 0; i < Math.ceil(data.length / itemsByPage); i++) { paginationArray.push(i) }
          setPageNumbers(paginationArray)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    fetchData()
    setPage()
    // Se obtienen los productos del carro de LocalStorage si hubiese
    setCartProducts(JSON.parse(localStorage.getItem("cart")))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Se actualiza el LocalStorage cada vez que se agrega o elimine productos del carro
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartProducts));
  }, [cartProducts])

  // Se hace una petición a la API acorde a la página, clasificación y orden solicitado
  const setPage = async (page = pagination, sort = sortBy, order = orderBy) => {
    setPagination(page)
    fetch(`http://localhost:3001/productos?_page=${page + 1}&_limit=${itemsByPage}&_sort=${sort}&_order=${order}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data)
      });
  }

  // Se clasifican y ordenan los productos acorde a la selección del usuario
  const dropDownButton = (e) => {
    setSortByTitle(e.target.textContent)
    switch (e.target.id) {
      case 'titulo':
        setPage(pagination, "titulo", "asc")
        setSortBy("titulo")
        setOrderBy("asc")
        break;
      case 'menor-precio':
        setPage(pagination, "valor_oferta_plano", "asc")
        setSortBy("valor_oferta_plano")
        setOrderBy("asc")
        break;
      case 'mayor-precio':
        setPage(pagination, "valor_oferta_plano", "desc")
        setSortBy("valor_oferta_plano")
        setOrderBy("desc")
        break;
      case 'mejor-calificacion':
        setPage(pagination, "calificaciones", "desc")
        setSortBy("calificaciones")
        setOrderBy("desc")
        break;
      default:
        setPage(pagination, "titulo", "asc")
        setSortBy("titulo")
        setOrderBy("asc")
    }
  }

  // Lógica para agregar al carro de compras
  const addToCart = (product) => {
    const index = cartProducts.findIndex((cartProduct) =>
      cartProduct.id_descuento === product.id_descuento
    )
    // Si el producto existe, agregar más cantidad
    if (index >= 0) {
      cartProducts[index].qty += 1
      // Máxima cantidad para un tipo de producto => 10
      if (cartProducts[index].qty > 9) {
        cartProducts[index].max_products = true
      }
      setCartProducts([...cartProducts])
    }
    // Si el producto no existe, crearlo en el Carro
    else {
      product.qty = 1
      product.max_products = false
      setCartProducts([...cartProducts, product])
    }
  }

  // Lógica para eliminar del carro de compras
  const deleteFromCart = (product) => {
    const index = cartProducts.findIndex((cartProduct) =>
      cartProduct.id_descuento === product.id_descuento
    )
    // Si existe una sola unidad del producto, se eliminarlo del carro
    if (cartProducts[index].qty === 1) {
      cartProducts.splice(index, 1)
    }
    // Reducir la cantidad de unidades del producto 
    else {
      cartProducts[index].qty -= 1
      cartProducts[index].max_products = false
    }
    setCartProducts([...cartProducts])
  }

  return (
    (welcome && localStorage.getItem("welcome") !== 'false') ?
      <div className="App-header">
        <img className="img-border-r-50" src={Logo} alt="Cuponatic Logo" />
        <h2>Bienvenid@s a la mini tienda <br /> Cuponatic Code Interview :)</h2>
        <p>
          Acceder a:
        </p>
        <div className="App-link" onClick={() => {
          setWelcome(false)
          localStorage.setItem("welcome", false)
        }}>
          Productos
        </div>
        <Link className="App-link" to="/carro">Carrito de Compras</Link>
      </div>
      :
      <div className="gradient-color">
        <Header />
        <div className="d-flex">
          <div className="d-flex center-hor-ver flex-column" style={{ flex: 2 }}>
            <div className="d-flex justify-content-center align-items-center w-50">
              <div className="d-flex justify-content-around align-items-center">
                <div className="font-header1 mr-4">Ordenar: </div>
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle"
                    type="button" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    {sortByTitle}
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <div id="titulo" value="really" onClick={(e) => dropDownButton(e)} className="dropdown-item">Título</div>
                    <div id="menor-precio" onClick={(e) => dropDownButton(e)} className="dropdown-item">Menor precio</div>
                    <div id="mayor-precio" onClick={(e) => dropDownButton(e)} className="dropdown-item">Mayor precio</div>
                    <div id="mejor-calificacion" onClick={(e) => dropDownButton(e)} className="dropdown-item">Mejor calificación</div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {
                  pageNumbers.map((page, key) => {
                    return (
                      pagination === key ?
                        <button key={key} onClick={() => setPage(page)} type="button" className="btn btn-success m-1">
                          {page + 1}
                        </button>
                        :
                        <button key={key} onClick={() => setPage(page)} type="button" className="btn btn-info m-1">
                          {page + 1}
                        </button>
                    )
                  })
                }
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-center">
              {
                products.map((product, key) => {
                  let maxProducts = false, index = cartProducts.findIndex((cartProduct) =>
                    cartProduct.id_descuento === product.id_descuento
                  )
                  if (index >= 0) { maxProducts = cartProducts[index].max_products }
                  // if(sortBy === "calificaciones" && !product.calificaciones){}
                  return (
                    <div key={key}>
                      <div className="card m-1" style={{ maxWidth: '320px', height: '465px' }}>
                        <img className="card-img-top" src={product.imagen} alt={`${product.titulo}`} />
                        <div className="card-body">
                          <h4 className="card-title"><b>{product.titulo}</b></h4>
                          <h5 className="col">Valor: {product.valor_oferta}</h5>
                          <div className="d-flex flex-row">
                            <div className="col p-0 font-card-small">
                              Distancia: {Math.random().toFixed(2)}kms
                            </div>
                            <div className="col p-0 font-card-small">
                              Calificación: {product.calificaciones ? product.calificaciones : 'n/a'}
                            </div>
                          </div>
                          <div className="d-flex center-hor-ver" style={{ minHeight: '94px' }}>
                            {
                              maxProducts ?
                                <div>
                                  <button type="button" className="btn btn-primary" disabled
                                    onClick={() => addToCart(product)}>
                                    Agregar <i className="fa fa-shopping-cart"></i>
                                  </button>
                                  <div className="font-card-mute">¡Alcanzaste el límite de compra!</div>
                                </div>
                                :
                                <button type="button" className="btn btn-primary"
                                  onClick={() => addToCart(product)}>
                                  Agregar <i className="fa fa-shopping-cart"></i>
                                </button>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="d-flex center-hor-ver">
              <div className="col-7 font-header1">Producto</div>
              <div className="col-5 font-header1">Cantidad</div>
            </div>
            {
              cartProducts.length === 0 ?
                <div className="font-header1 m-4">
                  No tienes productos.
                </div>
                :
                <div className="d-flex center-hor-ver flex-column" >
                  {
                    cartProducts.map((cartProduct, key) => {
                      return (
                        <div className="d-flex center-hor-ver py-3 w-100" key={key}
                          style={{ background: key % 2 === 0 ? '#FFFFFF' : '#F2F2F2' }}>
                          <div className="col-7">{cartProduct.titulo}</div>
                          <div className="col-5">x {cartProduct.qty}
                            <button type="button" className="btn btn-danger"
                              onClick={() => deleteFromCart(cartProduct)}><i className="fa fa-trash-o"></i>
                            </button>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
            }
            <Link to="/carro"><button type="button" className="btn btn-success m-4 btn-lg w-50">Pagar</button></Link>
          </div>
        </div>
      </div>
  )
}
