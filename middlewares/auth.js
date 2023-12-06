const prisma = require("../libs/prisma");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const authorizationHeader = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      error: "missing token",
    });
  }

  if (authorization.split(" ")[0] !== "Bearer") {
    return res.status(400).send({
      auth: false,
      message: "Bad Request",
      errors: "invalid token",
    });
  }

  const token = authorization.split(" ")[1];

  if (token.role !== "USER") {
    return res.status(503).json({
      status: false,
      message: "Forbidden Resource",
      error: "Tidak bisa akses aplikasi ini",
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
        error: err.message,
      });
    }

    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true,
      },
    });
    next();
  });
};

const authorizationQuery = (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      error: "missing token",
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
        error: err.message,
      });
    }

    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        is_verified: true,
        profile: true,
      },
    });
    next();
  });
};

const guardAdmin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      error: "missing token",
    });
  }

  if (authorization.split(" ")[0] !== "Bearer") {
    return res.status(400).send({
      auth: false,
      message: "Bad Request",
      errors: "invalid token",
    });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
        error: err.message,
      });
    }

    if (decoded.role !== "ADMIN") {
      return res.status(503).json({
        status: false,
        message: "Forbidden Resource",
        error: "Tidak bisa akses aplikasi ini",
      });
    }

    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true,
      },
    });
    next();
  });
};

module.exports = {
  authorizationHeader,
  authorizationQuery,
  guardAdmin,
};
