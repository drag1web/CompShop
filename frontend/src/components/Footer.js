import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faVk, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🖥 TechStore</h3>
          <p>Ваш надёжный поставщик компьютеров и комплектующих</p>
        </div>
        <div className="footer-section">
          <h4>Контакты</h4>
          <p>Тел: +7 (900) 123-45-67</p>
          <p>Email: info@techshop.ru</p>
        </div>
        <div className="footer-section">
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
        <p>© 2025 TechStore. Все права защищены.</p>
      </div>
    </footer>
  );
}

export default Footer;
