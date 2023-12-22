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
        is_verified: true,
        profile: true,
        created_at: true,
        notifications: {
          select: {
            id: true,
            title: true,
            body: true,
            created_at: true,
          },
        },
        class: true,
        payments: {
          include: {
            class: {
              select: {
                id: true,
                image_url: true,
                name: true,
                code: true,
                price: true,
              },
            },
          },
        },
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
        created_at: true,
        notifications: {
          select: {
            id: true,
            title: true,
            body: true,
            created_at: true,
          },
        },
        class: true,
        payments: true,
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
        error: "Akses ditolak",
      });
    }

    req.user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: {
          select: {
            id: true,
            profile_picture: true,
            phone_number: true,
            updated_at: true,
          },
        },
        notifications: {
          select: {
            id: true,
            title: true,
            body: true,
            created_at: true,
          },
        },
        class: true,
        created_at: true,
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
