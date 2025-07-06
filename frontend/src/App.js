import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Catalog from './Catalog';
import Footer from './components/Footer';
import Header from './components/Header';
import About from './pages/About';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';  // добавляем страницу корзины
import { CartProvider } from './components/CartContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';  
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
    <CartProvider> {/* оборачиваем всё приложение в провайдер корзины */}
      <Router>
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header /> {/* Header на всех страницах */}
          <div style={{ flex: 1 }}> {/* Контент занимает всё доступное пространство */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<ProductPage />} /> {/* Страница товара */}
              <Route path="/cart" element={<CartPage />} /> {/* Страница корзины */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />       {/* новый */}
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
