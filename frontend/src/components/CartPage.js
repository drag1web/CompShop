import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import HomeParticles from './HomeParticles';
import ParticlesBackground from './ParticlesBackground';
import './CartPage.css';

function CartPage() {
  const { cartItems, removeFromCart, clearCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();
  const [savedCartItems, setSavedCartItems] = useState([]);

  // Загрузка корзины из localStorage при монтировании компонента
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('cart')) || [];
    setSavedCartItems(savedItems);
  }, []);

  // Сохранение корзины в localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(savedCartItems));
  }, [savedCartItems]);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // Общая стоимость корзины
  const totalPrice = safeCartItems.reduce(
    (acc, item) => acc + (item.price ? item.price * item.quantity : 0), 
    0
  );

  const handleCheckout = () => {
    navigate('/checkout');
  };

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
      }, 300);
    } else {
      removeFromCart(id);
    }
  };

  // Функция для изменения количества товара
  const handleQuantityChange = (id, operation) => {
    const product = safeCartItems.find(item => item.product_id === id);
    if (!product) return;

    const newQuantity = operation === 'increase' ? product.quantity + 1 : product.quantity - 1;
    if (newQuantity >= 1) {
      updateCartItemQuantity(id, newQuantity);
    }
  };

  return (
    <>
      <ParticlesBackground />
      <HomeParticles />
      <div className="home-container-cart">
        <h1>Корзина</h1>

        {/* Если корзина пуста, показываем сообщение */}
        {safeCartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <div className="products-grid-cart">
              {/* Отображаем все товары в корзине */}
              {safeCartItems.map(item => {
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

                    {/* Увеличение / уменьшение количества */}
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.product_id, 'decrease')}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.product_id, 'increase')}
                      >
                        +
                      </button>
                    </div>

                    {/* Сообщение, если количество товара ограничено */}
                    {item.stock <= 0 && <p className="out-of-stock">Товар закончился</p>}
                    
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

            {/* Кнопка для очистки корзины */}
            <button
              onClick={clearCart}
              className="btn btn-primary-cart"
              style={{ marginTop: '20px' }}
            >
              Очистить корзину
            </button>

            {/* Сумма корзины и кнопка оформления заказа */}
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
