// server/middleware/errorMiddleware.js
import config from "../config/index.js";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // If headers have already been sent, delegate to the default Express error handler.
  if (res.headersSent) {
    console.error(
      "errorHandler Middleware: Headers already sent. Passing error to default Express handler."
    );
    return next(err);
  }

  // Determine status code.
  // If the error object itself has a statusCode property (custom error), use it.
  // Else, if res.statusCode was set by a previous middleware/controller AND it's an error code, use it.
  // Else, default to 500.
  let statusCode =
    err.statusCode ||
    (res.statusCode && res.statusCode >= 400 ? res.statusCode : 500);

  // Ensure a valid error status code
  if (statusCode < 400 || statusCode > 599) {
    statusCode = 500;
  }

  console.log(
    `errorHandler Middleware: Responding with status ${statusCode} for error: ${err.message}`
  );

  res.status(statusCode).json({
    // Set status and send JSON response in one go
    message: err.message,
    stack: config.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
