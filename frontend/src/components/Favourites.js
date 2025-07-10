import React, { useEffect } from 'react';
import { useFavourites } from './FavouritesContext';
import { Link } from 'react-router-dom';
import './Favourites.css';
import ParticlesBackground from './ParticlesBackground';
import HomeParticles from './HomeParticles';

function Favourites() {
  const { favourites, setFavourites } = useFavourites();

  useEffect(() => {
    async function loadFavourites() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Нет токена, очищаем избранное');
        setFavourites([]);
        return;
      }

      try {
        const favRes = await fetch('http://localhost:5000/api/favourites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!favRes.ok) {
          console.error('Ошибка при загрузке избранных:', favRes.status);
          setFavourites([]);
          return;
        }
        const favData = await favRes.json();
        console.log('Избранные product_id:', favData);

        if (favData.length === 0) {
          setFavourites([]); // Если избранных нет, очищаем
          return;
        }

        const productIds = favData.map(f => f.product_id);
        console.log('IDs продуктов:', productIds);

        // Получаем данные о продуктах
        const productsRes = await fetch(`http://localhost:5000/api/products?ids=${productIds.join(',')}`);
        if (!productsRes.ok) {
          console.error('Ошибка при загрузке продуктов:', productsRes.status);
          setFavourites([]);
          return;
        }
        const productsData = await productsRes.json();
        console.log('Данные продуктов:', productsData);

        // Устанавливаем избранные товары
        setFavourites(productsData.products || []);
      } catch (error) {
        console.error('Ошибка в fetch:', error);
        setFavourites([]);
      }
    }

    loadFavourites();
  }, [setFavourites]);

  

  const addToFavourites = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Нет токена');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/favourites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
  
      if (response.ok) {
        console.log('Товар добавлен в избранное');
        
        setFavourites((prevFavourites) => {
          // Добавляем новый товар в избранное
          return [...prevFavourites, { product_id: productId }];
        });
      } else {
        console.error('Ошибка при добавлении товара в избранное');
      }
    } catch (error) {
      console.error('Ошибка при добавлении товара в избранное', error);
    }
  };
  

  if (favourites.length === 0) {
    return (
      <>
        <ParticlesBackground />
        <HomeParticles />
        <div className="empty-message fade-in">Нет избранных товаров.</div>
      </>
    );
  }

  return (
    <>
      <ParticlesBackground />
      <HomeParticles />
      <div className="products-container-favourites">
        {favourites.map((product) => (
          <div key={product.id} className="product-card-favourites">
            <Link to={`/product/${product.id}`} className="product-link">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{parseFloat(product.price).toLocaleString()} ₽</p>
            </Link>
            <button onClick={() => addToFavourites(product.id)}>
              Добавить в избранное
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Favourites;
