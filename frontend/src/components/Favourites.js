import React, { useEffect } from 'react';
import { useFavourites } from './FavouritesContext';
import { Link } from 'react-router-dom';
import './Favourites.css';
import ParticlesBackground from './ParticlesBackground';
import HomeParticles from './HomeParticles';

function Favourites() {
  const { favourites, setFavourites } = useFavourites();

  // Функция загрузки избранных из API
  async function loadFavourites() {
  const token = localStorage.getItem('token');
  if (!token) {
    setFavourites([]);
    return;
  }
  try {
    const res = await fetch('http://localhost:5000/api/favourites', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    setFavourites(data); // data — массив полных продуктов
  } catch {
    setFavourites([]);
  }
}

  useEffect(() => {
    loadFavourites();
  }, );

  // Удаление из избранного
  const removeFromFavourites = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Нет токена');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/favourites/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Товар удален из избранного');
        await loadFavourites(); // обновляем список
      } else {
        console.error('Ошибка при удалении товара из избранного');
      }
    } catch (error) {
      console.error('Ошибка при удалении товара из избранного', error);
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
            <div>
              <button onClick={() => removeFromFavourites(product.id)}>
                Убрать из избранного
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Favourites;
