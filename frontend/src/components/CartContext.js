import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const API_BASE = 'http://localhost:5000';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE}/api/cart`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Ошибка загрузки корзины');
          }
          return res.json();
        })
        .then((data) => {
          setCartItems(data);
          localStorage.setItem('cart', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Ошибка при запросе корзины с сервера:', err);
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          setCartItems(localCart);
        });
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(localCart);
    }
  }, [user]);  // <--- вот добавляем зависимость от user

  const addToCart = async (product, quantity = 1) => {
    const productId = product.id || product.product_id || product._id;
    if (!productId) {
      console.error('Ошибка: product_id отсутствует в объекте продукта', product);
      return;
    }

    // ✅ Сначала обновляем локально
    setCartItems(prevCart => {
      const existingItem = prevCart.find(item => item.product_id === productId);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevCart.map(item =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, product_id: productId, quantity }];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart)); // синхронизируем с localStorage
      return updatedCart;
    });

    // ✅ Потом отправляем на сервер
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Нет токена для добавления товара');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        const updatedCartFromServer = await response.json();
        console.log('Корзина после POST:', updatedCartFromServer);

        // ✅ Перезаписываем локальный стейт только если сервер вернул нормальные данные
        if (Array.isArray(updatedCartFromServer) && updatedCartFromServer.length > 0) {
          setCartItems([...updatedCartFromServer]); // новая ссылка на массив
          localStorage.setItem('cart', JSON.stringify(updatedCartFromServer));
        } else {
          console.warn('Сервер вернул пустую корзину — оставляем локальную');
        }
      } else {
        const errorData = await response.json();
        console.error('Ошибка при добавлении товара:', errorData);
      }
    } catch (error) {
      console.error('Ошибка сети при добавлении товара', error);
    }
  };


  const removeFromCart = async (productId) => {
    // Обновляем локально сразу
    setCartItems(prevItems => {
      const updated = prevItems.filter(item => item.product_id !== productId);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Нет токена для удаления товара');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Ошибка при удалении товара из корзины');
        // Можно здесь опционально откатить изменения или показать сообщение
      }
    } catch (error) {
      console.error('Ошибка сети при удалении товара', error);
    }
  };

  async function clearCart() {
    // Обновляем локально сразу
    setCartItems([]);
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify([]));

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        console.error('Ошибка при очистке корзины на сервере');
        // Опционально откатить локальное состояние или показать ошибку
      }
    } catch (err) {
      console.error('Ошибка сети при очистке корзины', err);
    }
  }


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
