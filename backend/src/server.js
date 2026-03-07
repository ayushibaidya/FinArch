const env = require('./config/env');
const app = require('./app');

app.listen(env.port, () => {
  console.log(`FinArch API listening on port ${env.port}`);
});
