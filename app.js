require("dotenv").config();
const { PORT } = process.env;

const express = require("express");
const cors = require("cors");
const router = require("./routes");
const {
  notFoundHandler,
  internalErrorHandler,
  prismaErrorHandler,
  zodErrorHandler,
} = require("./middlewares/error");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./docs/swagger.json");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://real-skills.vercel.app",
  "http://localhost:8080",
  "https://real-skills-dev-fgnc.2.sg-1.fl0.io",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin Not allowed by CORS"));
      }
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", true);

// Routes
app.use("/api", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middlewares errors
app.use(zodErrorHandler);
app.use(prismaErrorHandler);
app.use(notFoundHandler);
app.use(internalErrorHandler);

app.listen(PORT || 8080, () => console.log(`Server running at http://localhost:${PORT}`));

module.exports = app;
