// src/Footer.js
import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faVk, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <h3>🖥 Магазин техники</h3>
          <p>Ваш надёжный поставщик компьютеров и комплектующих</p>
        </div>
        <div>
          <h4>Контакты</h4>
          <p>Тел: +7 (900) 123-45-67</p>
          <p>Email: info@techshop.ru</p>
        </div>
        <div>
          <h4>Соцсети</h4>
          <div className="social-icons">
            <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTelegram} />
            </a>
            <a href="https://vk.com/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faVk} />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Магазин техники. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;
