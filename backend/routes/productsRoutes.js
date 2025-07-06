const express = require('express');
const router = express.Router();
const pool = require('../db'); // импорт пула из модуля с подключением к БД

router.get('/', async (req, res) => {
  let {
    search,
    category,
    minPrice,
    maxPrice,
    sortBy = 'id',
    order = 'asc',
    page = 1,
    limit = 1000
  } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 1000;

  const offset = (page - 1) * limit;
  const filters = [];
  const values = [];
  let i = 1;

  if (search && search.trim()) {
    filters.push(`(LOWER(name) LIKE $${i} OR LOWER(description) LIKE $${i})`);
    values.push(`%${search.toLowerCase()}%`);
    i++;
  }

  if (category && category.trim()) {
    filters.push(`LOWER(category) = $${i}`);
    values.push(category.toLowerCase());
    i++;
  }

  if (minPrice && !isNaN(minPrice)) {
    filters.push(`price >= $${i}`);
    values.push(Number(minPrice));
    i++;
  }

  if (maxPrice && !isNaN(maxPrice)) {
    filters.push(`price <= $${i}`);
    values.push(Number(maxPrice));
    i++;
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const allowedSort = ['name', 'price', 'id', 'rating'];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'id';
  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  // Добавляем лимит и оффсет в values
  const limitIndex = i;     // следующий индекс для LIMIT
  const offsetIndex = i + 1; // следующий индекс для OFFSET

  values.push(limit);
  values.push(offset);

  const query = `
  SELECT * FROM products
  ${whereClause}
  ORDER BY ${sortColumn} ${sortOrder}
  LIMIT $${limitIndex} OFFSET $${offsetIndex}
`;

  try {
    const result = await pool.query(query, values);

    // Для подсчёта общего количества передаем только параметры фильтра (без limit и offset)
    const countValues = values.slice(0, i - 1);
    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].count, 10);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products: result.rows,
    });
  } catch (error) {
    console.error('Ошибка при получении списка товаров:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при получении товара по ID:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;

