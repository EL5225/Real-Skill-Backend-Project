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

  jwt.verify(authorization, JWT_SECRET, async (err, decoded) => {
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
        profile: true,
      },
    });
    next();
  });
};

module.exports = {
  authorizationHeader,
  authorizationQuery,
};
