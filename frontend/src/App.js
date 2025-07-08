import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from './Home';
import About from './pages/About';
import Catalog from './Catalog';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Scrollbutton from './components/Scrollbutton';

import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import { FavouritesProvider } from './components/FavouritesContext';

import ParticlesBackground from './components/ParticlesBackground';
import HomeParticles from './components/HomeParticles';

import ProductsList from './ProductsList';
import Favourites from './components/Favourites';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Header />

      {location.pathname === '/' && (
        <>
          <ParticlesBackground />
          <HomeParticles />
        </>
      )}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/favourites" element={<Favourites />} />
        </Routes>
      </div>

      <Footer />
      <Scrollbutton />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavouritesProvider>
          <Router>
            <div
              className="App"
              style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
            >
              <AppContent />
            </div>
          </Router>
        </FavouritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
