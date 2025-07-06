import React from 'react';
import { useCart } from './CartContext';
import '../Home.css';
import '../ProductsList.css'; // стили для карточек (если у тебя есть)
import HomeParticles from './HomeParticles';
import ParticlesBackground from './ParticlesBackground';

function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  return (
    <>
      <ParticlesBackground />
      <HomeParticles />
      <div className="home-container">
        <h1>Корзина</h1>

        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <div className="products-grid">
              {cartItems.map(item => (
                <div className="product-card" key={item.id}>
                  <img src={item.image} alt={item.name} className="product-image" />
                  <h2>{item.name}</h2>
                  <p className="price">{item.price.toLocaleString('ru-RU')} ₽</p>
                  <p>Количество: {item.quantity}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Удалить из корзины
                  </button>
                </div>
              ))}
            </div>

            <button onClick={clearCart} className="btn btn-primary" style={{ marginTop: '20px' }}>
              Очистить корзину
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default CartPage;
