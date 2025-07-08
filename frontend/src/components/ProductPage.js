import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import './ProductPage.css';
import HomeParticles from '../components/HomeParticles';
import ParticlesBackground from '../components/ParticlesBackground';


function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Товар не найден');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setQuantity(1);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const increment = () => {
    if (product.stock === undefined || quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  const rating = Number(product.rating);
  const inStock = product.stock > 0;

  return (
    <>
  <ParticlesBackground />
    <main className="product-page-modern" style={{ margin: '40px auto', maxWidth: '1100px' }}>
    <HomeParticles />
      <div className="product-images">
        <img
          key={product.id}
          src={product.image}
          alt={product.name}
          className="fade-in-image"
        />
      </div>

      <div className="product-details">
        <h1 className="product-title">{product.name}</h1>

        <div className="product-rating-stock">
          <div className="rating" aria-label={`Рейтинг товара ${rating} из 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < Math.floor(rating) ? 'star filled' : 'star'}
              >
                ★
              </span>
            ))}
            <span className="rating-value">{!isNaN(rating) ? rating.toFixed(1) : '-'}</span>
            <span className="rating-max">/ 5</span>
          </div>

          <div className={`stock ${inStock ? 'in-stock' : 'out-stock'}`}>
            {inStock ? `В наличии: ${product.stock}` : 'Нет в наличии'}
          </div>
        </div>

        <div className="price-block">
          {product.price.toLocaleString('ru-RU')} ₽
        </div>

        <div className="quantity-select">
          <button onClick={decrement} disabled={quantity <= 1}>−</button>
          <input type="number" readOnly value={quantity} />
          <button onClick={increment} disabled={quantity >= product.stock}>+</button>
        </div>

        <div className="actions">
          <button
            className="btn add-to-cart"
            onClick={handleAddToCart}
          >
            Добавить в корзину
          </button>
          <button className="btn buy-now">
            Купить сейчас
          </button>
        </div>

        <div className="product-info-extra">
          <table>
            <tbody>
              {product.category && (
                <tr>
                  <td>Категория</td>
                  <td>{product.category}</td>
                </tr>
              )}
              {product.brand && (
                <tr>
                  <td>Бренд</td>
                  <td>{product.brand}</td>
                </tr>
              )}
              {product.year && (
                <tr>
                  <td>Год выпуска</td>
                  <td>{product.year}</td>
                </tr>
              )}
              {product.sku && (
                <tr>
                  <td>Артикул</td>
                  <td>{product.sku}</td>
                </tr>
              )}
            </tbody>
          </table>

          {product.specs && product.specs.length > 0 && (
            <div className='product-description'>
              <strong>Характеристики:</strong>
              <ul>
                {product.specs.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="product-description">
          <h3>Описание</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </main>
    </>
  );
}

export default ProductPage;
