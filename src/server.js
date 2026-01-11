const app = require('./app');
const cfg = require('./config'); // src/config/index.js export ediyor olmalı
const logger = require('./lib/logger');

const port = cfg?.app?.port || process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server listening on http://localhost:${port}`);
});
