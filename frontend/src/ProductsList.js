import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ProductsList.css';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const categoryRefs = useRef({});

  // Загрузка товаров с сервера
  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=1000')
      .then(res => {
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Получаем уникальные категории из списка товаров
  const categories = [...new Set(products.map(p => p.category))];

  // Создаем рефы для каждой категории (делаем это в useEffect, чтобы не создавать на каждом рендере)
  useEffect(() => {
    categories.forEach(cat => {
      if (!categoryRefs.current[cat]) {
        categoryRefs.current[cat] = React.createRef();
      }
    });
  }, [categories]);

  // Обработчик выбора категории из меню — закрываем меню и скроллим к секции
  const handleCategorySelect = (cat) => {
    setDropdownOpen(false);
    const section = categoryRefs.current[cat]?.current;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Закрываем выпадающее меню при клике вне его
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return <div className="loader1">Загрузка товаров...</div>;
  if (products.length === 0) return <div className="no-products1">Товары не найдены.</div>;

  return (
    <div className="products-container1">
      <div className="dropdown1" ref={dropdownRef}>
        <button
          className="dropdown-toggle1"
          onClick={e => {
            e.stopPropagation(); // Останавливаем всплытие, чтобы не сработал глобальный клик
            setDropdownOpen(!dropdownOpen);
          }}
        >
          Выберите категорию ▼
        </button>
        {dropdownOpen && (
          <ul className="dropdown-menu1">
            {categories.map(cat => (
              <li
                key={cat}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

      {categories.map(cat => (
        <section
          key={cat}
          className="category-section1"
          ref={categoryRefs.current[cat]}
          id={`category-${cat.replace(/\s+/g, '-')}`}
        >
          <h2>{cat}</h2>
          <div className="products-grid1">
            {products
              .filter(p => p.category === cat)
              .map(product => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="product-card1"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image1"
                  />
                  <h2>{product.name}</h2>
                  <p className="description1">{product.description}</p>
                  <p className="price1">{product.price.toLocaleString()} ₽</p>
                  <button
                    className="btn1 btn-primary1"
                    onClick={e => e.preventDefault()}
                  >
                    Купить
                  </button>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default ProductsList;
