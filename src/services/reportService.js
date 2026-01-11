const { Order, Customer, sequelize } = require('../models');
const { Op } = require('sequelize');

async function getGeneralStats() {
    const totalCustomers = await Customer.count();
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalAmount');
    
    const ordersByStatus = await Order.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('Order.id')), 'count']],
        group: ['status']
    });

    return {
        totalCustomers,
        totalOrders,
        totalRevenue: totalRevenue || 0,
        ordersByStatus
    };
}

async function getTopCustomers(limit = 5) {
    return Order.findAll({
        attributes: [
            'customerId',
            [sequelize.fn('COUNT', sequelize.col('Order.id')), 'orderCount'],
            [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalSpent']
        ],
        include: [{
            model: Customer,
            as: 'customer',
            attributes: ['firstName', 'lastName', 'email']
        }],
        where: {
            customerId: { [Op.ne]: null }
        },
        group: ['customerId', 'customer.id'],
        order: [[sequelize.literal('totalSpent'), 'DESC']],
        limit
    });
}

module.exports = {
    getGeneralStats,
    getTopCustomers
};
