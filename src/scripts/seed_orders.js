const { Order, Customer } = require('../models');

async function seed() {
    const customers = await Customer.findAll();
    if (customers.length === 0) {
        console.log('No customers found to seed orders.');
        return;
    }

    const statuses = ['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    
    for (let i = 0; i < 10; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        await Order.create({
            customerId: customer.id,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            totalAmount: Math.floor(Math.random() * 1000) + 100
        });
    }

    // Birkaç guest siparişi
    await Order.create({
        guestName: 'Guest User 1',
        guestPhone: '+905001112233',
        guestAddress: 'Ankara',
        status: 'DELIVERED',
        totalAmount: 250.50
    });

    console.log('Orders seeded successfully.');
}

seed().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
