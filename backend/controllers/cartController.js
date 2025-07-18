const pool = require("../db");

// Получить корзину
exports.getCart = async (req, res) => {
    const userId = req.user.id;  // берем из токена, а не из params!
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
        res.status(500).json({ error: "Ошибка при получении корзины" });
    }
};

// Добавить товар
exports.addToCart = async (req, res) => {
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

        res.json({ message: "Товар добавлен в корзину" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка при добавлении товара" });
    }
};

// Обновить количество
exports.updateCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    try {
        if (quantity <= 0) {
            await pool.query(
                `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
                [userId, productId]
            );
            return res.json({ message: "Товар удалён из корзины" });
        }

        await pool.query(
            `UPDATE cart_items SET quantity = $3 WHERE user_id = $1 AND product_id = $2`,
            [userId, productId, quantity]
        );
        res.json({ message: "Количество обновлено" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка при обновлении корзины" });
    }
};

// Удалить товар
exports.deleteFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
    try {
        await pool.query(
            `DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`,
            [userId, productId]
        );
        res.json({ message: "Товар удалён из корзины" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка при удалении товара" });
    }
};

// В cartController.js
exports.clearCart = async (req, res) => {
    const userId = req.user.id;
    console.log('Clear cart for user:', userId);  // Для отладки
    try {
        await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
        res.json({ message: 'Корзина очищена' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при очистке корзины' });
    }
};

