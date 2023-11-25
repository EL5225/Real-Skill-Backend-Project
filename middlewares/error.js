const { Prisma } = require("@prisma/client");
const { ZodError } = require("zod");

const prismaErrorHandler = (err, req, res, next) => {
  const error = err.message.split("\n");

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      error: error[error.length - 1],
    });
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      error: error[error.length - 1],
    });
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      error: error[error.length - 1],
    });
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      error: error[error.length - 1],
    });
  }

  return next(err);
};

const zodErrorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: false,
      message: "Bad Request",
      error: {
        name: `Invalid input on property ${err.issues[0].path[0]}`,
        detail: err.errors[0].message,
      },
    });
  }
  return next(err);
};

const notFoundHandler = (req, res) => {
  return res.status(404).json({
    status: false,
    message: "Not found",
  });
};

const internalErrorHandler = (err, req, res) => {
  return res.status(500).json({
    status: false,
    message: err.message,
  });
};

module.exports = {
  notFoundHandler,
  internalErrorHandler,
  prismaErrorHandler,
  zodErrorHandler,
};
