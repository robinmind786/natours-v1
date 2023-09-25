const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./src/routes/tourRoutes');
const userRouter = require('./src/routes/userRoutes');
const reviewRouter = require('./src/routes/reviewRoutes');
const AppError = require('./src/utils/appError');
const globalErrorcontroller = require('./src/controllers/errorController');

// development helping/logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// global middleware
const limiter = rateLimit({
  max: 15,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// global route supply here
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

// global error supply here
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorcontroller);

module.exports = app;
