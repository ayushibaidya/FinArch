const express = require('express');
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();
const cors = require('cors'); 

app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:5173'], 
    credentials: true, 
  }), 
);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
