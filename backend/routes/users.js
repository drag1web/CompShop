const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware'); 

// Получить данные пользователя
router.get('/me', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT id, username, email, phone, address FROM users WHERE id = $1',
      [userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить профиль
router.put('/me', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { username, email, phone, address } = req.body;

  if (!username || !email) return res.status(400).json({ message: 'Имя и email обязательны' });

  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $1, email = $2, phone = $3, address = $4
       WHERE id = $5
       RETURNING id, username, email, phone, address`,
      [username, email, phone, address, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json({ message: 'Профиль обновлён', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Смена пароля
router.put('/change-password', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Требуются старый и новый пароли' });
  }

  try {
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });

    const userPasswordHash = result.rows[0].password;
    const isMatch = await bcrypt.compare(oldPassword, userPasswordHash);
    if (!isMatch) return res.status(400).json({ message: 'Старый пароль неверен' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);

    res.json({ message: 'Пароль успешно изменён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
