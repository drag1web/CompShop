import React, { useState, useEffect } from 'react';
import './Scrollbutton.css';

export default function ScrollButton() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      if (scrolled > 300) {
        if (!visible) setVisible(true);
        if (fadeOut) setFadeOut(false);
      } else {
        if (visible && !fadeOut) {
          setFadeOut(true);
          timeoutId = setTimeout(() => {
            setVisible(false);
            setFadeOut(false);
          }, 400); // длина анимации исчезновения в CSS
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [visible, fadeOut]);

const scrollToTop = () => {
  if (window.pageYOffset === 0) {
    // Если уже наверху, просто сбросить состояние кнопки
    setVisible(false);
    setFadeOut(false);
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


  if (!visible) return null;

  return (
    <button
      className={`scroll-button ${fadeOut ? 'fade-out' : 'fade-in'}`}
      onClick={scrollToTop}
      aria-label="Наверх"
      title="Наверх"
    >
      ↑
      <span className="glow" />
    </button>
  );
}
