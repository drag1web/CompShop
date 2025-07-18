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

const isFavourite = (productId) => favourites.some(fav => fav.id === productId);

const loadFavourites = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setFavourites([]);
    return;
  }
  try {
    const favRes = await fetch('http://localhost:5000/api/favourites', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!favRes.ok) throw new Error('Ошибка загрузки избранного');

    const favData = await favRes.json();

    if (!favData.length) {
      setFavourites([]);
      return;
    }

    // Предположим, что favData — массив с объектами { product_id: 123 }
    // Собираем id
    const productIds = favData.map(f => f.product_id || f.id);

    // Делаем запрос за товарами по id
    const productsRes = await fetch(`http://localhost:5000/api/products?ids=${productIds.join(',')}`);
    if (!productsRes.ok) throw new Error('Ошибка загрузки продуктов избранного');

    const productsData = await productsRes.json();

    // productsData.products — массив с полными товарами
    setFavourites(productsData.products || []);
  } catch (error) {
    console.error(error);
    setFavourites([]);
  }
};


  const toggleFavourite = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) return;

    const isAlreadyFavourite = isFavourite(product.id);

    try {
      if (isAlreadyFavourite) {
        const response = await fetch(`http://localhost:5000/api/favourites/${product.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Ошибка удаления из избранного');
      } else {
        const response = await fetch('http://localhost:5000/api/favourites', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id }),
        });
        if (!response.ok) throw new Error('Ошибка добавления в избранное');
      }

      await loadFavourites(); // Обновляем стейт из API после успешного запроса
    } catch (error) {
      console.error(error);
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
                <div key={product.id} className="product-card1">

                  {/* Сама карточка без кнопки - это ссылка */}
                  <Link
                    to={`/product/${product.id}`}
                    className="product-info"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <img src={product.image} alt={product.name} className="product-image1" />
                    <h2>{product.name}</h2>
                    <p className="description1">{product.description}</p>
                    <p className="price1">{product.price.toLocaleString()} ₽</p>
                  </Link>

                  {/* Кнопка избранного вне ссылки */}
                  <button
                    className={`btn-favourite ${isFavourite(product.id) ? 'active' : ''}`}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavourite(e, product);
                    }}
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

                </div>
              ))}

          </div>
        </section>
      ))}
    </div>
  );
}

export default ProductsList;
