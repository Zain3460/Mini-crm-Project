const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');



const express = require('express');
const logger = require('./lib/logger');
const { randomUUID } = require('crypto');

const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');
const reportsRouter = require('./routes/reports');
const productsRouter = require('./routes/products');

const app = express();

// body parser
app.use(express.json());

// ✅ 1) Trace ID (en üstte olmalı)
app.use((req, res, next) => {
  const traceId = req.headers['x-trace-id'] || randomUUID();
  req.traceId = traceId;
  res.setHeader('X-Trace-Id', traceId);
  next();
});

// ✅ 2) Request log (response time + status)
app.use((req, res, next) => {
  const t0 = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - t0;
    logger.info('request', {
      traceId: req.traceId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ms
    });
  });
  next();
});

// ✅ 3) Health endpoint (module.exports'tan önce!)
app.get('/', (req, res) => res.json({ ok: true, service: 'mini-crm' }));

const openapi = YAML.load(path.resolve(__dirname, '../docs/openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));


// routes
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/products', productsRouter);

// error handler (en sonda)
// Moha: 'next' parametresi artık kullanılmadığı için kaldırıldı.
app.use((err, req, res) => {
  console.error(err);
  logger.error('Unhandled error', { message: err.message, stack: err.stack, traceId: req.traceId });

  const msg = (process.env.NODE_ENV !== 'production' && err?.message)
    ? err.message
    : 'Bir hata oluştu';

  res.status(err.status || 500).json({ message: msg, traceId: req.traceId });
});

module.exports = app;
