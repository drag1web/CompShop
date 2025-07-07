import React from 'react';
import './About.css'
import ParticlesBackground from '../components/ParticlesBackground';
import HomeParticles from '../components/HomeParticles';

const About = () => {
  return (
    <>
  <ParticlesBackground />
      <div className="about-container">
      <HomeParticles />
        <h1>О нас</h1>
        <p className="intro-text">
          Добро пожаловать в наш магазин компьютерной техники! Мы предлагаем широкий выбор качественных продуктов и всегда готовы помочь вам с выбором.
        </p>
        
        <div className="buttons">
          <button className="btn">Наши преимущества</button>
          <button className="btn">Специальные предложения</button>
        </div>
        
        <section className="aboutabout">
          <h2>Наша миссия</h2>
          <p>
            Предоставлять качественную компьютерную технику и отличный сервис нашим клиентам.
          </p>
        </section>

        <section className="about-advantages">
          <h2>Преимущества</h2>
          <ul>
            <li>Широкий ассортимент</li>
            <li>Гарантия и поддержка</li>
            <li>Быстрая доставка</li>
          </ul>
        </section>

        <section className="about-special-offers">
          <h2>Специальные предложения</h2>
          <p>Следите за акциями и скидками на самые популярные товары.</p>
        </section>
      </div>
      </>
  );
};

export default About;
