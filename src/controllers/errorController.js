const AppError = require("../utils/appError");

// invalid id error
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} ${err.value}`;
  return new AppError(message, 400);
};

// duplicate field error handling
const handleDuplicateFieldDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// validation error handling
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// development error handling (don't leak error details to client/public)
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// production error handling (error will be meaningful/readable  for client/public)
const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client/public
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // programming or other unknown error: don't leak error details (make the error a nice readable message for client/public)
    console.error("Error 🥵", err);

    // send a readable/meaningfull message to client/public
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!😴",
    });
  }
};

// JSON web token error handling
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

// JSON web token expire error hangling
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

// all error supply station both development and production mode
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
