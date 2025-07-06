import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductsList.css';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Все');
  const [loading, setLoading] = useState(true); // новое состояние

  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=1000')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Ошибка сервера: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Данные с сервера:', data);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['Все', ...new Set(products.map(p => p.category))];

  const filteredProducts =
    category === 'Все'
      ? products
      : products.filter(p => p.category === category);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="products-container">
      <div className="categories-menu">
        {categories.map(cat => (
          <button
            key={cat}
            className={cat === category ? 'category-btn active' : 'category-btn'}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="page-fade">
        {loading ? (
          <div className="loader">Загрузка товаров...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">Нет товаров в этой категории.</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="product-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h2>{product.name}</h2>
                <p className="description">{product.description}</p>
                <p className="price">{product.price.toLocaleString()} ₽</p>
                <button
                  className="btn btn-primary"
                  onClick={e => e.preventDefault()}
                >
                  Купить
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsList;
