const express = require('express');
const router = express.Router();
const authRouter = require('./api/auth');
const productRouter = require('./api/product');
const orderRouter = require('./api/order');
const reviewRouter = require('./api/review');
const favRouter = require('./api/fav');


/**
 * Handles login, register, reset password.
 */
router.use('/auth', authRouter);


/**
 * Handles CRUD on products, adding to fav.
 */
router.use('/product', productRouter);

/**
 * Handles making and viewing orders 
 */
router.use('/order', orderRouter);

/**
 * Handles making and viewing reviews on products 
 */
router.use('/review', reviewRouter);

router.use('/fav', favRouter);

module.exports = router;
