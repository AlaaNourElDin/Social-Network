const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const BaseError = require("./exceptions/BasrError");
const globalErrorHandler = require("./exceptions/errorHandler");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(`${__dirname}/public`));

// Routers
app.use("/users", userRouter);

app.all("*", (req, res, next) => {
  next(new BaseError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
