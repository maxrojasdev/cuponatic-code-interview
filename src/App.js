import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Products from './components/Products';
import Cart from './components/Cart';

function App() {
  return (
    <Router>
      <div className="App gradient-color">
          <Routes>
            <Route className="App-link" path="/" element={<Products/>}>Productos</Route>
            <Route className="App-link" path="/carro" element={<Cart/>}>Carrito de Compra</Route>
          </Routes>
      </div>
    </Router>
  );
}

export default App;
