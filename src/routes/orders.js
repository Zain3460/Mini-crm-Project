const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');
const orderService = require('../services/orderService');

// GET /api/orders?status=PENDING&customerId=1
router.get('/', async (req, res, next) => {
  try {
    const rows = await orderService.listOrders({
      status: req.query.status,
      customerId: req.query.customerId
    });
    res.json(rows);
  } catch (err) {
    logger.error('Error listing orders', { err });
    next(err);
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    logger.error('Error getting order', { err });
    next(err);
  }
});

// POST /api/orders
router.post('/', async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    logger.error('Error creating order', { err });
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
});

// PUT /api/orders/:id
router.put('/:id', async (req, res, next) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    logger.error('Error updating order', { err });
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    
    const order = await orderService.updateOrder(req.params.id, { status });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    logger.error('Error updating order status', { err });
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const ok = await orderService.deleteOrder(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Order not found' });
    res.status(204).send();
  } catch (err) {
    logger.error('Error deleting order', { err });
    next(err);
  }
});

module.exports = router;
