import React, { useState, useEffect } from 'react';
import HomeParticles from './HomeParticles';
import ParticlesBackground from './ParticlesBackground';

const faqData = [
  {
    question: 'Как оформить заказ?',
    answer: 'Чтобы оформить заказ, добавьте товары в корзину и перейдите к оформлению, следуя инструкциям на сайте.',
  },
  {
    question: 'Какие способы оплаты вы принимаете?',
    answer: 'Мы принимаем оплату банковскими картами, электронными кошельками и наличными при получении.',
  },
  {
    question: 'Как отследить заказ?',
    answer: 'После оформления заказа вам будет предоставлен трек-номер, который можно использовать для отслеживания доставки.',
  },
  {
    question: 'Что делать, если товар поврежден?',
    answer: 'Если товар поврежден, свяжитесь с нашей службой поддержки в течение 48 часов после получения для решения проблемы.',
  },
  {
    question: 'Как вернуть или обменять товар?',
    answer: 'Вы можете вернуть или обменять товар в течение 14 дней при сохранении товарного вида и упаковки.',
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!window.Tawk_API) {
      var Tawk_API = window.Tawk_API || {}, Tawk_LoadStart = new Date();
      (function () {
        var s1 = document.createElement("script"),
          s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/your_property_id/default'; // Замени на свой ID
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
      })();
    }
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Спасибо! Ваше сообщение отправлено.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
    <ParticlesBackground>
    <div
      style={{
        position: 'relative',
        maxWidth: 600,
        margin: '40px auto',
        padding: 20,
        fontFamily: 'Arial, sans-serif',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#121212', // добавил фон для контраста с частицами
        color: '#eee',
      }}
    >
      <HomeParticles />

      <h1 style={{ marginBottom: 20 }}>Поддержка и помощь</h1>

      <p>Если у вас возникли вопросы или проблемы, мы всегда готовы помочь! Ниже представлены ответы на популярные вопросы и наши контакты.</p>

      <section style={{ marginBottom: 30 }}>
        <h2>Часто задаваемые вопросы</h2>
        <div>
          {faqData.map(({ question, answer }, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 15px',
                  fontSize: 16,
                  background: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  outline: 'none',
                }}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {question}
              </button>
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  style={{
                    background: '#333',
                    color: '#ddd',
                    padding: '10px 15px',
                    borderRadius: '0 0 6px 6px',
                    marginTop: 2,
                    fontSize: 15,
                  }}
                >
                  {answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2>Контакты</h2>
        <p>📞 Телефон: +7 (123) 456-78-90</p>
        <p>📧 Email: support@yourdomain.com</p>
        <p>⏰ Часы работы: Пн-Пт с 9:00 до 18:00</p>
      </section>

      <section>
        <h2>Свяжитесь с нами</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            name="name"
            placeholder="Ваше имя"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ padding: 8, fontSize: 16, borderRadius: 6, border: 'none', background: '#222', color: '#eee' }}
          />
          <input
            name="email"
            type="email"
            placeholder="Ваш email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ padding: 8, fontSize: 16, borderRadius: 6, border: 'none', background: '#222', color: '#eee' }}
          />
          <textarea
            name="message"
            placeholder="Ваше сообщение"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            style={{ padding: 8, fontSize: 16, borderRadius: 6, border: 'none', background: '#222', color: '#eee', resize: 'vertical' }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 15px',
              fontSize: 16,
              cursor: 'pointer',
              borderRadius: 6,
              border: 'none',
              background: 'linear-gradient(90deg, #ff6d00, #ff8f00)',
              color: '#fff',
              fontWeight: '600',
              boxShadow: '0 6px 16px rgba(255, 109, 0, 0.5)',
              transition: 'background 0.3s ease, transform 0.1s ease',
            }}
          >
            Отправить
          </button>
        </form>
        {status && <p style={{ marginTop: 10, color: 'lightgreen' }}>{status}</p>}
      </section>
    </div>
    </ParticlesBackground>
    </>
  );
}
