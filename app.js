const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const tourRouter = require("./src/routes/tourRoutes");
const userRouter = require("./src/routes/userRoutes");
const AppError = require("./src/utils/appError");
const globalErrorcontroller = require("./src/controllers/errorController");

// development helping/logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// global middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

//Allow all requests from all domains & localhost
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

// global route supply here
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

// global error supply here
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorcontroller);

module.exports = app;
