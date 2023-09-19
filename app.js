const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const tourRouter = require('./src/routes/tourRoutes');
const AppError = require('./src/utils/appError');
const globalErrorcontroller = require('./src/controllers/errorController');

// development helping/logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// global middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// global route supply here
app.use('/api/v1/tours', tourRouter);

// global error supply here
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorcontroller);

module.exports = app;
