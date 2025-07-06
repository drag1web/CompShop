import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductPage.css';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="product-page">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <p className="product-price">{product.price.toLocaleString('ru-RU')} ₽</p>

        {/* Дополнительная информация */}
        {product.category && <p><strong>Категория:</strong> {product.category}</p>}
        {product.brand && <p><strong>Бренд:</strong> {product.brand}</p>}
        {product.year && <p><strong>Год выпуска:</strong> {product.year}</p>}
        {product.rating && <p><strong>Рейтинг:</strong> {product.rating.toFixed(1)} / 5</p>}
        {product.sku && <p><strong>Артикул:</strong> {product.sku}</p>}
        {typeof product.stock !== 'undefined' && (
          <p><strong>Наличие:</strong> {product.stock > 0 ? 'В наличии' : 'Нет в наличии'}</p>
        )}
        {product.specs && product.specs.length > 0 && (
          <div>
            <strong>Характеристики:</strong>
            <ul>
              {product.specs.map((spec, i) => (
                <li key={i}>{spec}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="product-actions">
          <button className="btn btn-add-to-cart">Добавить в корзину</button>
          <button className="btn btn-buy-now">Купить сейчас</button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
