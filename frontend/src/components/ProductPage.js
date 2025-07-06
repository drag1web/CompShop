import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';
import HomeParticles from '../components/HomeParticles';
import ParticlesBackground from '../components/ParticlesBackground';
import { useCart } from '../components/CartContext';  // импортируем хук

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart } = useCart();  // получаем функцию добавления в корзину

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Товар не найден');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  return (
    <>
      <ParticlesBackground />
      <div className="home-container">
        <HomeParticles />
        <div className="product-page-wrapper fade-in">
          <div className="product-page">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-info">
              <h1 className="product-name">{product.name}</h1>
              <p className="product-description">{product.description}</p>

              <p className="product-price">
                {product.price.toLocaleString('ru-RU')} ₽
              </p>

              <p className="product-category">
                <b>Категория:</b> {product.category}
              </p>

              {product.brand && (
                <p className="product-extra"><b>Бренд:</b> {product.brand}</p>
              )}

              {product.year && (
                <p className="product-extra"><b>Год выпуска:</b> {product.year}</p>
              )}

              {product.sku && (
                <p className="product-extra"><b>Артикул:</b> {product.sku}</p>
              )}

              {typeof product.stock !== 'undefined' && (
                <p className="product-extra">
                  <b>Наличие:</b> {product.stock > 0 ? 'В наличии' : 'Нет в наличии'}
                </p>
              )}

              {product.rating != null && !isNaN(product.rating) && (
                <p className="product-extra">
                    <b>Рейтинг:</b> {Number(product.rating).toFixed(1)} / 5
                </p>
              )}

              {product.specs && product.specs.length > 0 && (
                <div className="product-extra">
                  <b>Характеристики:</b>
                  <ul className="product-specs">
                    {product.specs.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="product-actions">
                <button className="product-btn" onClick={() => addToCart(product)}>
                  Добавить в корзину
                </button>
                <button className="product-btn">Купить сейчас</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
