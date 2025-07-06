import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeParticles from './components/HomeParticles';
import ParticlesBackground from './components/ParticlesBackground';
import Carousel from './components/Carousel';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
      <>
  <ParticlesBackground />
  <div className="home-container">
    <HomeParticles />

    <div className="page-fade">
      <section className="hero">
        <h1>Добро пожаловать в TechStore!</h1>
        <Carousel />
        <div className="hero-buttons">
          <button onClick={() => navigate('/catalog')} className="btn btn-primary">
            Перейти в каталог
          </button>
          <button onClick={() => navigate('/catalog?filter=new')} className="btn btn-secondary">
            Смотреть новинки
          </button>
        </div>
      </section>

      <section className="about">
  <h2>О магазине</h2>
  <p>Мы предлагаем только качественную технику от лучших производителей, обеспечивая надежность и долгий срок службы каждой покупки.</p>

  <ul className="about-features">
    <li>✅ Оригинальная продукция с гарантиями</li>
    <li>🚚 Быстрая доставка по всей стране</li>
    <li>💬 Профессиональная консультация и поддержка</li>
    <li>🔧 Бесплатное сервисное обслуживание</li>
  </ul>
</section>


      <section className="advantages">
        <h2>Почему выбирают нас</h2>
        <ul>
          <li>Гарантия качества и сервиса</li>
          <li>Широкий ассортимент</li>
          <li>Быстрая доставка по всей стране</li>
        </ul>
      </section>

      <section className="testimonials neon-theme">
  <h2 className="section-title">Отзывы наших клиентов</h2>
  <div className="testimonial-list">
    <div className="testimonial-card">
      <p className="testimonial-text">
        “Отличный сервис! Заказ пришёл быстро, техника работает идеально. Рекомендую всем!”
      </p>
      <span className="testimonial-author">— Иван Петров</span>
    </div>

    <div className="testimonial-card">
      <p className="testimonial-text">
        “Большой выбор товаров и вежливые консультанты. Помогли подобрать ноутбук для работы.”
      </p>
      <span className="testimonial-author">— Мария Сидорова</span>
    </div>

    <div className="testimonial-card">
      <p className="testimonial-text">
        “Покупаю здесь уже не первый раз. Цены радуют, доставка быстрая. Спасибо TechStore!”
      </p>
      <span className="testimonial-author">— Алексей Иванов</span>
        </div>
      </div>
    </section>
 
      <section className="special-offers">
        <h2>Специальные предложения</h2>
        <p>Следите за обновлениями, чтобы не пропустить скидки и акции!</p>
      </section>
    </div>
  </div>
</>
  );
}

export default Home;
