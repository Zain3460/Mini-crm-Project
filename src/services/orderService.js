'use strict';

const { Order, Customer, Product, OrderItem, sequelize } = require('../models');

const ALLOWED_STATUSES = ['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function normalizeStatus(s) {
  if (s == null) return null;
  const up = String(s).trim().toUpperCase();
  return up;
}

async function listOrders({ status, customerId } = {}) {
  const where = {};
  if (status) where.status = normalizeStatus(status);
  if (customerId) where.customerId = Number(customerId);

  return Order.findAll({
    where,
    order: [['id', 'DESC']],
    include: [
      {
        model: Customer,
        as: 'customer',
        required: false,
        attributes: ['id', 'firstName', 'lastName', 'phone', 'email']
      },
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }
    ]
  });
}

async function getOrderById(id) {
  return Order.findByPk(id, {
    include: [
      {
        model: Customer,
        as: 'customer',
        required: false,
        attributes: ['id', 'firstName', 'lastName', 'phone', 'email']
      },
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }]
      }
    ]
  });
}

async function createOrder(payload) {
  const data = {
    customerId: payload.customerId ?? null,
    guestName: payload.guestName ?? null,
    guestPhone: payload.guestPhone ?? null,
    guestAddress: payload.guestAddress ?? null,
    status: normalizeStatus(payload.status) || 'PENDING',
    totalAmount: payload.totalAmount ?? 0
  };
  
  const items = payload.items || [];
  // Geriye dönük uyumluluk için tekil productId/quantity desteği
  if (payload.productId) {
    items.push({ productId: payload.productId, quantity: payload.quantity || 1 });
  }

  if (!ALLOWED_STATUSES.includes(data.status)) {
    const err = new Error(`Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}`);
    err.status = 400;
    throw err;
  }

  // müşteri varsa doğrula
  if (data.customerId) {
    const c = await Customer.findByPk(data.customerId);
    if (!c) {
      const err = new Error('Customer not found');
      err.status = 400;
      throw err;
    }
  } else {
    // guest sipariş için minimum bilgi
    if (!data.guestName || !data.guestPhone) {
      const err = new Error('Guest order requires guestName and guestPhone when customerId is not provided');
      err.status = 400;
      throw err;
    }
  }

  const transaction = await sequelize.transaction();
  try {
    // Adres kontrolü (Kargo için gerekliyse)
    if (!data.guestAddress && !data.customerId) {
      const err = new Error('Address is required for guest orders');
      err.status = 400;
      throw err;
    }

    const order = await Order.create(data, { transaction });
    let calculatedTotal = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.trackStock && product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      if (product.trackStock) {
        await product.update({ stockQuantity: product.stockQuantity - item.quantity }, { transaction });
      }

      const itemTotalPrice = product.price * item.quantity;
      calculatedTotal += itemTotalPrice;

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotalPrice
      }, { transaction });
    }

    // Eğer totalAmount gönderilmemişse veya 0 ise hesaplanan toplamı kullan
    if (data.totalAmount === 0) {
      await order.update({ totalAmount: calculatedTotal }, { transaction });
    }

    await transaction.commit();
    return await getOrderById(order.id);
  } catch (err) {
    await transaction.rollback();
    err.status = err.status || 400;
    throw err;
  }
}

async function updateOrder(id, payload) {
  const order = await Order.findByPk(id);
  if (!order) return null;

  const patch = {};
  if (payload.customerId !== undefined) patch.customerId = payload.customerId || null;
  if (payload.guestName !== undefined) patch.guestName = payload.guestName || null;
  if (payload.guestPhone !== undefined) patch.guestPhone = payload.guestPhone || null;
  if (payload.guestAddress !== undefined) patch.guestAddress = payload.guestAddress || null;
  if (payload.totalAmount !== undefined) patch.totalAmount = payload.totalAmount;

  if (payload.status !== undefined) {
    const st = normalizeStatus(payload.status);
    if (!ALLOWED_STATUSES.includes(st)) {
      const err = new Error(`Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}`);
      err.status = 400;
      throw err;
    }
    patch.status = st;
  }

  // customerId set ediliyorsa doğrula
  if (patch.customerId) {
    const c = await Customer.findByPk(patch.customerId);
    if (!c) {
      const err = new Error('Customer not found');
      err.status = 400;
      throw err;
    }
  }

  await order.update(patch);
  return order;
}

async function deleteOrder(id) {
  const order = await Order.findByPk(id);
  if (!order) return false;
  await order.destroy();
  return true;
}

module.exports = {
  ALLOWED_STATUSES,
  listOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
