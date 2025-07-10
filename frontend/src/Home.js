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

          {/* <section className="about">
            <p>
              Добро пожаловать в наш магазин! 
            </p>
          </section> */}

          <section className="advantages">
            <h2>Почему выбирают нас</h2>
            <p>
              Мы гордимся тем, что наши клиенты всегда остаются довольны не только качеством товаров, но и нашим сервисом. Мы стремимся предоставить лучший опыт покупки и обслуживания. Вот несколько причин, почему выбирают нас:
            </p>
            <ul>
              <li>
                <strong>Гарантия качества и сервиса:</strong> Мы предлагаем продукцию только от надежных и проверенных производителей. Каждая единица техники проходит тщательную проверку перед поступлением в продажу, а наша команда готова помочь в решении любых вопросов по эксплуатации и обслуживанию.
              </li>
              <li>
                <strong>Широкий ассортимент:</strong> Мы постоянно обновляем наш ассортимент, чтобы предложить вам самые последние и актуальные модели. У нас вы найдете как бюджетные варианты, так и премиум-класса товары, которые подойдут для любых нужд и предпочтений.
              </li>
              <li>
                <strong>Быстрая доставка по всей стране:</strong> Мы понимаем, как важна оперативность. Поэтому гарантируем доставку в самые короткие сроки, будь то крупный город или удалённый регион. Мы работаем с надежными курьерскими службами, чтобы ваша покупка была доставлена в целости и сохранности.
              </li>
              <li>
                <strong>Индивидуальный подход к каждому клиенту:</strong> Мы ценим каждого покупателя и стараемся учитывать все ваши предпочтения и пожелания. Наша служба поддержки всегда готова предоставить консультации и помочь с выбором товара.
              </li>
              <li>
                <strong>Постоянные акции и скидки:</strong> Мы часто проводим специальные акции, распродажи и предлагаем скидки на различные товары. Покупая у нас, вы получаете не только качественную продукцию, но и выгодные условия для своего бюджета.
              </li>
              <li>
                <strong>Удобные способы оплаты:</strong> Мы предоставляем разнообразные варианты оплаты, включая онлайн-оплату, кредитные карты и наложенный платеж. Выбирайте тот способ, который вам удобен.
              </li>
            </ul>
          </section>


          <section className="testimonials neon-theme">
            <h2 className="section-title">Отзывы наших клиентов</h2>
            <p className="section-subtitle">
              Мы гордимся тем, что наши клиенты довольны качеством продукции и обслуживанием. Вот что они говорят о нас:
            </p>
            <div className="testimonial-list">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  “Отличный сервис! Заказ пришёл быстро, техника работает идеально. Рекомендую всем! Не разочаруетесь!”
                </p>
                <span className="testimonial-author">— Иван Петров</span>
                <div className="testimonial-rating">
                  <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="testimonial-text">
                  “Большой выбор товаров и вежливые консультанты. Помогли подобрать ноутбук для работы, очень довольна покупкой.”
                </p>
                <span className="testimonial-author">— Мария Сидорова</span>
                <div className="testimonial-rating">
                  <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="testimonial-text">
                  “Покупаю здесь уже не первый раз. Цены радуют, доставка быстрая. Спасибо TechStore! Буду заказывать снова!”
                </p>
                <span className="testimonial-author">— Алексей Иванов</span>
                <div className="testimonial-rating">
                  <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                </div>
              </div>
              <div className="testimonial-card">
              <p className="testimonial-text">
                “Очень доволен покупкой! Сайт прост в использовании, оформление заказа быстрое. Техника работает как новенькая!”
              </p>
              <span className="testimonial-author">— Сергей Ковалев</span>
              <div className="testimonial-rating">
                <span className="rating-stars">⭐⭐⭐⭐⭐</span>
              </div>
            </div>
            </div>


            <div className="testimonial-call-to-action">
              <p>Хотите стать частью нашего числа довольных клиентов? Оформите заказ прямо сейчас!</p>
              <button onClick={() => navigate('/catalog')} className="cta-button">Перейти в каталог</button>
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
