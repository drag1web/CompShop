import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import './CheckoutPage.css';
import ParticlesBackground from './ParticlesBackground';
import DeliveryCalculator from './DeliveryCalculator';

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedService, setSelectedService] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [deliveryCost, setDeliveryCost] = useState(500);
  const phoneInputRef = useRef(null);
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
  };

  // Обработчик отправки формы заказа
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Введите корректный номер телефона');
      phoneInputRef.current.focus();
      return;
    }

    if (paymentMethod === 'card') {
      const { cardNumber, expiryDate, cvv } = cardDetails;
      if (!cardNumber || !expiryDate || !cvv) {
        setError('Введите данные карты');
        return;
      }
    }

    if (paymentMethod === 'online' && !selectedService) {
      setError('Выберите платёжный сервис');
      return;
    }

    const token = localStorage.getItem('token');

    const orderData = {
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      comment: comment.trim(),
      paymentMethod,
      paymentDetails: paymentMethod === 'card' ? cardDetails : selectedService,
      items: cartItems.map((item) => ({
        productId: item.product_id || item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalPrice + deliveryCost,
      deliveryCost,
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Не удалось оформить заказ');
      }

      const result = await response.json();
      console.log('✅ Заказ успешно создан:', result);

      setSuccess(true);
      clearCart();
      setError(null);

      // Если выбрана онлайн-оплата, переходим на страницу оплаты
      if (paymentMethod === 'online') {
        navigate(`/payment/${selectedService}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Произошла ошибка при оформлении заказа');
    }
  };

  return (
    <ParticlesBackground>
      <main className="checkout-page">
        <h1>Оформление заказа</h1>
        {success ? (
          <div className="checkout-success">
            ✅ Спасибо за заказ, {name}! Мы свяжемся с вами для подтверждения.
          </div>
        ) : (
          <>
            <section className="cart-summary">
              <h2>Ваш заказ</h2>
              <ul>
                {cartItems.map((item) => (
                  <li key={item.id} className="cart-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                  </li>
                ))}
              </ul>
              <div className="total">
                Итог: <strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong>
              </div>
              <div className="delivery-cost">
                Доставка: <strong>{deliveryCost.toLocaleString('ru-RU')} ₽</strong>
              </div>
              <div className="total final-total">
                К оплате: <strong>{(totalPrice + deliveryCost).toLocaleString('ru-RU')} ₽</strong>
              </div>
            </section>

            <DeliveryCalculator address={address} onCostCalculated={setDeliveryCost} />

            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
              <h2>Данные покупателя</h2>
              {error && <div className="form-error">{error}</div>}

              <label>
                Имя <span className="required">*</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                />
              </label>

              <label>
                Телефон <span className="required">*</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  ref={phoneInputRef}
                  placeholder="+7 (999) 999-99-99"
                  required
                />
              </label>

              <label>
                Адрес доставки <span className="required">*</span>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  required
                />
              </label>

              <label>
                Комментарий к заказу
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder="Например, удобное время доставки"
                />
              </label>

              <fieldset className="payment-method">
                <legend>
                  Способ оплаты <span className="required">*</span>
                </legend>

                {/* Оплата банковской картой */}
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span>Банковской картой</span>
                </label>

                {paymentMethod === "card" && (
                  <div className="payment-details">
                    <label>
                      Номер карты
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardNumber: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Срок действия
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            expiryDate: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      CVV
                      <input
                        type="password"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cvv: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                )}

                {/* Оплата наличными */}
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                  <span>Наличными курьеру</span>
                </label>

                {/* Онлайн оплата */}
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <span>Онлайн через платёжный сервис</span>
                </label>

                {paymentMethod === "online" && (
                  <div className="payment-details">
                    <p>Выберите сервис:</p>
                    <label>
                      <input
                        type="radio"
                        name="onlineService"
                        value="sbp"
                        checked={selectedService === "sbp"}
                        onChange={() => setSelectedService("sbp")}
                      />
                      <span>СБП (Система быстрых платежей)</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="onlineService"
                        value="yookassa"
                        checked={selectedService === "yookassa"}
                        onChange={() => setSelectedService("yookassa")}
                      />
                      <span>YooKassa</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="onlineService"
                        value="paypal"
                        checked={selectedService === "paypal"}
                        onChange={() => setSelectedService("paypal")}
                      />
                      <span>PayPal</span>
                    </label>
                  </div>
                )}
              </fieldset>
              <div className="form-buttons">
                <button type="submit" className="btn confirm-order">
                  Оформить заказ
                </button>
                <button
                  type="button"
                  className="btn cancel-order"
                  onClick={() => window.history.back()}
                >
                  Вернуться в корзину
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </ParticlesBackground>
  );
}

export default CheckoutPage;
