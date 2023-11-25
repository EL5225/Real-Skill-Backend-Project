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

const customCssUrl = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";
const customJs = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set("trust proxy", true);

// Routes
app.use("/api", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customCssUrl, customJs }));

// Middlewares errors
app.use(zodErrorHandler);
app.use(prismaErrorHandler);
app.use(notFoundHandler);
app.use(internalErrorHandler);

app.listen(PORT || 8080, () => console.log(`Server running at http://localhost:${PORT}`));

module.exports = app;
