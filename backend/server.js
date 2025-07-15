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


// Получить товар по id
// GET /api/products — вернуть все или по фильтру ids/limit/search
app.get('/api/products', async (req, res) => {
  try {
    const { ids, limit, search } = req.query;

    // если передан параметр поиска
    if (search) {
      const q = `%${search}%`;
      const result = await pool.query(
        `SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 LIMIT 100`,
        [q]
      );
      return res.json({ products: result.rows });
    }

    // если передан список ids
    if (ids) {
      const idsArray = ids.split(',').map(id => parseInt(id)).filter(Boolean);
      if (idsArray.length === 0) {
        return res.json({ products: [] });
      }
      const result = await pool.query(
        `SELECT * FROM products WHERE id = ANY($1::int[])`,
        [idsArray]
      );
      return res.json({ products: result.rows });
    }

    // иначе — обычный список по limit
    const limitNum = parseInt(limit) || 1000;
    const result = await pool.query(
      `SELECT * FROM products LIMIT $1`,
      [limitNum]
    );
    res.json({ products: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при получении товаров' });
  }
});

// GET /api/products/:id — вернуть один товар
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );
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
      `SELECT c.product_id, c.quantity, p.name, p.price, p.image
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );

    res.json(result.rows); // Отправляем корзину на фронт
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при загрузке корзины' });
  }
});

// Добавить товар в корзину
app.post('/api/cart', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    // Проверяем, есть ли уже товар в корзине
    const existingProduct = await pool.query(
      `SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );

    if (existingProduct.rows.length > 0) {
      // Если товар есть, обновляем количество
      await pool.query(
        `UPDATE cart_items SET quantity = quantity + $3 
         WHERE user_id = $1 AND product_id = $2`,
        [userId, productId, quantity]
      );
    } else {
      // Если товара нет, добавляем его
      await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [userId, productId, quantity]
      );
    }

    // ✅ Возвращаем полную корзину с данными о продуктах
    const result = await pool.query(
      `SELECT c.product_id, c.quantity, p.name, p.price, p.image
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении товара' });
  }
});




// Обновить количество товара в корзине
app.put('/api/cart', authMiddleware, async (req, res) => {
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
app.delete('/api/cart/remove/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    await pool.query(
      `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );

    // ✅ Возвращаем актуальную корзину
    const result = await pool.query(
      `SELECT c.product_id, c.quantity, p.name, p.price, p.image
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении товара' });
  }
});

// Получить избранные товары пользователя
app.get('/api/favourites', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // Получаем все product_id для текущего user_id
    const result = await pool.query(
      `SELECT product_id FROM favourites WHERE user_id = $1`,
      [userId]
    );

    // Если нет избранных товаров
    if (result.rows.length === 0) {
      return res.json([]); // Отправляем пустой массив
    }

    const productIds = result.rows.map(row => row.product_id);

    // Запрос для получения подробной информации о продуктах
    const productsResult = await pool.query(
      `SELECT * FROM products WHERE id = ANY($1::int[])`,
      [productIds]
    );


    res.json(productsResult.rows); // Отправляем найденные продукты
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при получении избранного' });
  }
});




// Добавить товар в избранное
app.post('/api/favourites', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    
    await pool.query(
      `INSERT INTO favourites (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, productId]
    );

    res.status(201).send();
  } catch (err) {
    console.error('Ошибка при добавлении в избранное:', err);
    res.status(500).json({ message: 'Ошибка при добавлении в избранное' });
  }
});




// Удалить товар из избранного
app.delete('/api/favourites/:productId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;
  try {
    await pool.query(
      `DELETE FROM favourites WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при удалении из избранного' });
  }
});

// Создать заказ
app.post('/api/orders', authMiddleware, async (req, res) => {
  const userId = req.user.id; // Из JWT
  const { customerName, phone, address, items, total } = req.body;

  if (!customerName || !phone || !address || !items || items.length === 0) {
    return res.status(400).json({ message: 'Некорректные данные заказа' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Начинаем транзакцию

    // 1️⃣ Вставляем заказ
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, customer_name, phone, address, total)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userId, customerName, phone, address, total]
    );

    const orderId = orderResult.rows[0].id;

    // 2️⃣ Вставляем товары
    const insertItemsQuery = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
    `;

    for (const item of items) {
      await client.query(insertItemsQuery, [
        orderId,
        item.productId,
        item.quantity,
        item.price
      ]);
    }

    // 3️⃣ Очищаем корзину пользователя
    await client.query(
      `DELETE FROM cart_items WHERE user_id = $1`,
      [userId]
    );

    await client.query('COMMIT'); // Подтверждаем транзакцию

    res.status(201).json({ message: 'Заказ успешно оформлен', orderId });
  } catch (err) {
    await client.query('ROLLBACK'); // Откат при ошибке
    console.error('Ошибка при создании заказа:', err);
    res.status(500).json({ message: 'Ошибка при создании заказа' });
  } finally {
    client.release();
  }
});

// Получить заказы текущего пользователя
app.get('/api/orders', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // Получаем заказы пользователя
    const ordersResult = await pool.query(
      `SELECT id, customer_name, phone, address, total, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    const orders = ordersResult.rows;

    // Для каждого заказа можно получить товары
    for (let order of orders) {
      const itemsResult = await pool.query(
        `SELECT product_id, quantity, price
         FROM order_items
         WHERE order_id = $1`,
        [order.id]
      );
      order.items = itemsResult.rows;
    }

    res.json(orders);
  } catch (err) {
    console.error('Ошибка при получении заказов:', err);
    res.status(500).json({ message: 'Ошибка сервера при получении заказов' });
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