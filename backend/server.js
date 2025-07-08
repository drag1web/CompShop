const express = require('express'); 
const cors = require('cors');
const pool = require('./db');  // Импорт пула из db.js
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const jwt = require('jsonwebtoken');


const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use('/api/cart', cartRoutes);


// Проверка подключения к базе
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Получить товары
app.get('/api/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    const result = await pool.query('SELECT * FROM products LIMIT $1', [limit]);
    res.json({ products: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при получении товаров' });
  }
});

// Получить товар по id
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при получении товара' });
  }
});


// Получить корзину пользователя
app.get('/api/cart', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT c.product_id, p.name, p.price, c.quantity 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении корзины' });
  }
});


// Добавить товар в корзину
app.post('/api/cart', async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    const updateResult = await pool.query(
      `UPDATE cart_items SET quantity = quantity + $3 
       WHERE user_id = $1 AND product_id = $2 RETURNING *`,
      [userId, productId, quantity]
    );

    if (updateResult.rowCount === 0) {
      await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [userId, productId, quantity]
      );
    }

    res.json({ message: 'Товар добавлен в корзину' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении товара' });
  }
});

// Обновить количество товара в корзине
app.put('/api/cart', async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    if (quantity <= 0) {
      await pool.query(
        `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
        [userId, productId]
      );
      return res.json({ message: 'Товар удалён из корзины' });
    }

    await pool.query(
      `UPDATE cart_items SET quantity = $3 WHERE user_id = $1 AND product_id = $2`,
      [userId, productId, quantity]
    );
    res.json({ message: 'Количество обновлено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении корзины' });
  }
});

// Удалить товар из корзины
app.delete('/api/cart/clear', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    res.json({ message: 'Корзина очищена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при очистке корзины' });
  }
});


app.use('/api/auth', authRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Нет авторизации' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}