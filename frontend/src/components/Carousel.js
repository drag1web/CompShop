import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css';

const slides = [
  {
    id: 1,
    title: 'Скидки до 20% на ноутбуки!',
    description: 'Успей купить по выгодным ценам лучшие модели.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Новинка! Видеокарты RTX 40 серии',
    description: 'Мощь и производительность нового поколения.',
    image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Мониторы Samsung 24"',
    description: 'Чёткое изображение и удобный дизайн.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  },
];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      goNext();
    }, 4000);

    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  const goNext = () => {
    clearTimeout(timeoutRef.current); // Очищаем таймер
    setDirection('next'); // Устанавливаем направление прокрутки
    setCurrentIndex((prev) => (prev + 1) % slides.length); // Обновляем индекс слайдов
  };

  return (
    <div className="carousel">
      <div className="slider-window">
        <div
          className={`slider-track ${direction}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              className="slide"
              key={slide.id}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-content">
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Carousel;
