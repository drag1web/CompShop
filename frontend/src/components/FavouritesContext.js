import React, { createContext, useState, useContext, useEffect } from 'react';

const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/favourites', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Не удалось загрузить избранные');
        return res.json();
      })
      .then(data => {
        // data — массив { product_id: ... }
        // Если нужно получить данные товаров, можно здесь сделать дополнительный запрос,
        // или, например, хранить сразу объекты товаров на сервере.
        setFavourites(data);
      })
      .catch(err => {
        console.error('Ошибка загрузки избранных:', err);
      });
  }, []);

  return (
    <FavouritesContext.Provider value={{ favourites, setFavourites }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavouritesContext);
}
