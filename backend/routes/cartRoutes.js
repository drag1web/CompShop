const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require('../middleware/authMiddleware');

// Роуты корзины
router.get("/:userId", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/", cartController.updateCart);
router.delete("/", cartController.deleteFromCart);
router.delete('/clear/:userId', cartController.clearCart);
router.use(authMiddleware);


module.exports = router;
