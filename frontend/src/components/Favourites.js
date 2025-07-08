import React from 'react';
import { useFavourites } from './FavouritesContext';
import { Link } from 'react-router-dom';
import '../ProductsList.css';


function Favourites() {
  const { favourites } = useFavourites();

  if (favourites.length === 0) return <p>Нет избранных товаров.</p>;

  return (
    <div className="products-container1">
      {favourites.map(product => (
        <Link to={`/product/${product.id}`} key={product.id} className="product-card1">
          <img src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p>{product.price.toLocaleString()} ₽</p>
        </Link>
      ))}
    </div>
  );
}

export default Favourites;
