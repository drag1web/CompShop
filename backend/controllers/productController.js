// backend/controllers/productController.js

const pool = require('../db'); // подключение к базе

// Получить все товары
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить товар по ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Товар не найден' });
    }
  } catch (error) {
    console.error('Ошибка при получении товара по ID:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = { getAllProducts, getProductById };
