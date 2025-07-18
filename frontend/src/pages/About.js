import React from 'react';
import './About.css';
import ParticlesBackground from '../components/ParticlesBackground';
import HomeParticles from '../components/HomeParticles';

const About = () => {
  return (
    <>
      <ParticlesBackground />
      <div className="about-about-container">
        <HomeParticles />

        <h1>О нас</h1>
        <p className="about-intro-text">
          Добро пожаловать в наш магазин компьютерной техники! Мы предлагаем широкий выбор качественных продуктов и всегда готовы помочь вам с выбором.
        </p>

        <div className="about-buttons">
          <button className="about-btn">Наши преимущества</button>
          <button className="about-btn">Специальные предложения</button>
          <button className="about-btn">Отзывы клиентов</button>
          <button className="about-btn">Контакты</button>
        </div>

        <section className="about-about-mission">
          <h2>Наша миссия</h2>
          <p>
            Предоставлять качественную компьютерную технику и отличный сервис нашим клиентам, делая технологии доступнее и понятнее.
          </p>
        </section>

        <section className="about-about-vision">
          <h2>Наше видение</h2>
          <p>
            Быть лидером в области продаж компьютерной техники, внедряя инновации и поддерживая долгосрочные отношения с клиентами.
          </p>
        </section>

        <section className="about-about-advantages">
          <h2>Преимущества</h2>
          <ul>
            <li>Широкий ассортимент: от комплектующих до готовых систем</li>
            <li>Гарантия и поддержка: мы всегда рядом, чтобы помочь</li>
            <li>Быстрая доставка по всей стране</li>
            <li>Консультации специалистов и помощь в выборе</li>
            <li>Удобные способы оплаты и гибкая система скидок</li>
          </ul>
        </section>

        <section className="about-about-special-offers">
          <h2>Специальные предложения</h2>
          <p>Следите за акциями и скидками на самые популярные товары. Мы регулярно обновляем предложения, чтобы вы могли покупать выгодно.</p>
          <ul>
            <li>Сезонные распродажи</li>
            <li>Эксклюзивные скидки для постоянных клиентов</li>
            <li>Подарки при покупке определённых товаров</li>
          </ul>
        </section>

        <section className="about-about-reviews">
          <h2>Отзывы клиентов</h2>
          <blockquote>
            "Отличный магазин! Быстрая доставка и качественные товары. Рекомендую всем!" — Иван П.
          </blockquote>
          <blockquote>
            "Очень помогли с выбором ноутбука. Спасибо за профессионализм!" — Мария К.
          </blockquote>
          <blockquote>
            "Лучшее соотношение цены и качества, всегда обращаюсь сюда." — Алексей С.
          </blockquote>
        </section>

        <section className="about-about-team">
          <h2>Наша команда</h2>
          <p>Мы — команда профессионалов, объединённых любовью к технологиям и желанием помочь каждому клиенту.</p>
          <ul>
            <li>Александр — Основатель и генеральный директор</li>
            <li>Екатерина — Руководитель отдела продаж</li>
            <li>Дмитрий — Специалист по технической поддержке</li>
            <li>Ольга — Маркетолог и SMM-менеджер</li>
          </ul>
        </section>

        <section className="about-about-contact">
          <h2>Контакты</h2>
          <p>Мы всегда на связи:</p>
          <ul>
            <li>Телефон: +7 (123) 456-78-90</li>
            <li>Email: info@computerstore.ru</li>
            <li>Адрес: г. Москва, ул. Технопарковая, д. 12</li>
            <li>Время работы: Пн-Пт 9:00 – 18:00</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default About;
