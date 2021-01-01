const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const BaseError = require('./exceptions/BasrError');
const globalErrorHandler = require('./exceptions/errorHandler');
const authRouter = require('./routes/authRouter');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

// Routers
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.all('*', (req, res, next) => {
  next(new BaseError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
