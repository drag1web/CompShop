import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ProductsList.css';
import { useFavourites } from './components/FavouritesContext';

// ✅ Путь к иконкам
import likeIcon from './components/assets/icons/like.png';
import heartIcon from './components/assets/icons/heart1.png';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const categoryRefs = useRef({});
  const { favourites, setFavourites } = useFavourites();

  // Загрузка товаров с сервера
  useEffect(() => {
    fetch('http://localhost:5000/api/products?limit=1000')
      .then(res => {
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);


  useEffect(() => {
    categories.forEach(cat => {
      if (!categoryRefs.current[cat]) {
        categoryRefs.current[cat] = React.createRef();
      }
    });
  }, [categories]);

  const handleCategorySelect = (cat) => {
    setDropdownOpen(false);
    const section = categoryRefs.current[cat]?.current;
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) return <div className="loader1">Загрузка товаров...</div>;
  if (products.length === 0) return <div className="no-products1">Товары не найдены.</div>;

  const favouriteProducts = products.filter(product =>
    favourites.some(fav => fav.id === product.id)
  );

  const isFavourite = (productId) => favourites.some(fav => fav.id === productId);

  const toggleFavourite = (e, product) => {
  e.preventDefault();
  e.stopPropagation();

  // Проверяем, есть ли товар в избранном
  const isAlreadyFavourite = isFavourite(product.id);

  // Если товар в избранном
  if (isAlreadyFavourite) {
    // Удаляем товар из избранного
    const updatedFavourites = favourites.filter(fav => fav.id !== product.id);
    setFavourites(updatedFavourites); // Обновляем контекст с новыми избранными товарами

    // Отправляем запрос на сервер для удаления
    fetch(`http://localhost:5000/api/favourites/${product.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).catch(console.error);
  } else {
    // Добавляем товар в избранное
    const updatedFavourites = [...favourites, product];
    setFavourites(updatedFavourites); // Обновляем контекст с новыми избранными товарами

    // Отправляем запрос на сервер для добавления
    fetch('http://localhost:5000/api/favourites', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: product.id }),
    }).catch(console.error);
  }
};

  

  return (
    <div className="products-container1">
      <div className="dropdown1" ref={dropdownRef}>
        <button
          className="dropdown-toggle1"
          onClick={e => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
        >
          Категория ▼
        </button>
        {dropdownOpen && (
          <ul className="dropdown-menu1">
            {categories.map(cat => (
              <li
                key={cat}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

      {categories.map(cat => (
        <section
          key={cat}
          className="category-section1"
          ref={categoryRefs.current[cat]}
          id={`category-${cat.replace(/\s+/g, '-')}`}
        >
          <h2>{cat}</h2>
          <div className="products-grid1">
            {products
              .filter(p => p.category === cat)
              .map(product => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="product-card1"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image1"
                  />
                  <h2>{product.name}</h2>
                  <p className="description1">{product.description}</p>
                  <p className="price1">{product.price.toLocaleString()} ₽</p>

                  {/* ✅ Кнопка избранного с иконками */}
                  <button
                    className={`btn-favourite ${isFavourite(product.id) ? 'active' : ''}`}
                    onClick={e => toggleFavourite(e, product)}
                    aria-label={isFavourite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                    title={isFavourite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                    type="button"
                  >
                    <img
                      src={isFavourite(product.id) ? heartIcon : likeIcon}
                      alt="Избранное"
                      className="favourite-icon"
                    />
                  </button>

                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default ProductsList;
