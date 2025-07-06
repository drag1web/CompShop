import React from 'react';
import ProductsList from './ProductsList';
import HomeParticles from './components/HomeParticles';
import ParticlesBackground from './components/ParticlesBackground';
import './Home.css';  // тот же css, что и для Home

function Catalog() {
  return (
    <>
      <ParticlesBackground />
      <div className="home-container">
        <HomeParticles />
        <section className="hero">
          <h1>Каталог товаров</h1>
          {/* Здесь можно добавить что-то похожее на Carousel, если надо */}
        </section>

        <section className="products-list">
          <ProductsList />
        </section>
      </div>
    </>
  );
}

export default Catalog;
