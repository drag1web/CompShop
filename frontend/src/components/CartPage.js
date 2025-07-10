import React from 'react';
import { useCart } from './CartContext';
import HomeParticles from './HomeParticles';
import ParticlesBackground from './ParticlesBackground';
import './CartPage.css';

function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  // Считаем итоговую сумму
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const totalPrice = safeCartItems.reduce(
    (acc, item) => acc + (item.price ? item.price * item.quantity : 0), 0
  );

  // Оформление заказа
  const handleCheckout = () => {
    alert("🎉 Спасибо за заказ! Оформляем...");
  };

  // Анимация удаления
  const handleRemove = (id) => {
    if (!id) {
      console.error("Ошибка: Невалидный product_id", id);
      return;
    }

    const card = document.querySelector(`#product-${id}`);
    if (card) {
      card.classList.add('removing');
      setTimeout(() => {
        removeFromCart(id);
      }, 300); // дождаться анимации
    } else {
      // fallback если не нашлось
      removeFromCart(id);
    }
  };

  return (
    <>
      <ParticlesBackground />
      <HomeParticles />
      <div className="home-container-cart">
        <h1>Корзина</h1>

        {safeCartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <div className="products-grid-cart">
              {safeCartItems.map(item => {
                // Проверяем наличие цены и корректность данных
                const validPrice = item.price && !isNaN(item.price) ? item.price : 0;
                return (
                  <div
                    className="product-card-cart"
                    key={item.product_id}
                    id={`product-${item.product_id}`}
                  >
                    <img src={item.image} alt={item.name} className="product-image-cart" />
                    <h2>{item.name}</h2>
                    <p className="price-cart">
                      {validPrice > 0 ? validPrice.toLocaleString('ru-RU') : 'Цена не доступна'} ₽
                    </p>
                    <p>Количество: {item.quantity}</p>
                    <button
                      className="btn btn-danger-cart"
                      onClick={() => handleRemove(item.product_id)}
                    >
                      Удалить из корзины
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={clearCart}
              className="btn btn-primary-cart"
              style={{ marginTop: '20px' }}
            >
              Очистить корзину
            </button>

            <div className="cart-summary">
              <p>
                Итого:{' '}
                <span style={{ color: '#ff9800', fontWeight: '700' }}>
                  {totalPrice.toFixed(2)} ₽
                </span>
              </p>
              <button
                className="btn btn-primary-cart checkout-btn"
                onClick={handleCheckout}
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartPage;
