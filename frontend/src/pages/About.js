import React from 'react';
import '../Home.css'; 
import ParticlesBackground from '../components/ParticlesBackground';
import HomeParticles from '../components/HomeParticles';

const About = () => {
  return (
    <>
      <ParticlesBackground />
      <div className="home-container about-clean">
        <HomeParticles />
        <h1>О нас</h1>
        <p className="intro-text">
          Добро пожаловать в наш магазин компьютерной техники! Мы предлагаем широкий выбор качественных продуктов и всегда готовы помочь вам с выбором.
        </p>
        
        <div className="buttons">
          <button className="btn">Наши преимущества</button>
          <button className="btn">Специальные предложения</button>
        </div>
        
        <section className="about">
          <h2>Наша миссия</h2>
          <p>
            Предоставлять качественную компьютерную технику и отличный сервис нашим клиентам.
          </p>
        </section>

        <section className="advantages">
          <h2>Преимущества</h2>
          <ul>
            <li>Широкий ассортимент</li>
            <li>Гарантия и поддержка</li>
            <li>Быстрая доставка</li>
          </ul>
        </section>

        <section className="special-offers">
          <h2>Специальные предложения</h2>
          <p>Следите за акциями и скидками на самые популярные товары.</p>
        </section>
      </div>
    </>
  );
};

export default About;
