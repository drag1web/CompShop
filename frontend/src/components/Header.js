import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

function Header() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const profileRef = useRef(null);

  // Поиск продуктов
  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmedQuery = query.trim();
  
      if (trimmedQuery) {
        const apiUrl = `http://localhost:5000/api/products?search=${encodeURIComponent(trimmedQuery)}`;
  
        fetch(apiUrl)
          .then(res => res.json())
          .then(data => setResults(data.products || []))
          .catch(err => console.error(err));
  
        setIsDropdownVisible(true);
      } else {
        // Если строка пустая — сбросить результаты
        setResults([]);
        setIsDropdownVisible(false);
      }
    }, 300);
  
    return () => clearTimeout(timeout);
  }, [query]);
  
  // Закрытие выпадашек по клику вне
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current && !containerRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAddress(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="header">
      <div className="container header-flex">
        <div className="header-left">
          <div className={`address ${showAddress ? 'show' : 'hide'}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="address-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z" />
            </svg>
            г. Москва, ул. Примерная, д. 1
          </div>
          <Link to="/" className="logo">🖥 TechStore</Link>
        </div>

        <div
          className="search-container"
          ref={containerRef}
          onFocus={() => query && setIsDropdownVisible(true)}
          style={{ position: 'relative' }}
        >
          <input
            type="text"
            placeholder="Поиск..."
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query && setIsDropdownVisible(true)}
          />
          {query && isDropdownVisible && results.length > 0 && (
            <ul className="search-dropdown">
              {results.map(product => (
                <li key={product.id}>
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </li>
              ))}
            </ul>
          )}
          {query && isDropdownVisible && results.length === 0 && (
            <div className="search-dropdown empty">Ничего не найдено</div>
          )}
        </div>

        <nav className="nav">
          <Link to="/catalog">Каталог</Link>
          <Link to="/about">Мы</Link>
          <Link to="/contacts">Контакты</Link>
          <Link to="/cart" className="nav-link cart-button">
            🛒
            {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
          </Link>

          {user ? (
            <div className="profile-wrapper" ref={profileRef}>
              <button
                className="profile-button"
                onClick={() => setProfileMenuOpen(prev => !prev)}
              >
                👤 {user.username} ▾
              </button>
              <div className={`profile-dropdown ${profileMenuOpen ? 'show' : ''}`}>
                <Link to="/profile" className="dropdown-item">Мой профиль</Link>
                <Link to="/orders" className="dropdown-item">Заказы</Link>
                <button className="dropdown-item" onClick={logout}>Выйти</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link login-btn">Войти</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
