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

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set("trust proxy", true);

// Routes
app.use("/api", router);

// Middlewares errors
app.use(zodErrorHandler);
app.use(prismaErrorHandler);
app.use(notFoundHandler);
app.use(internalErrorHandler);

<<<<<<< HEAD
app.listen(PORT || 8080, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
=======
app.listen(PORT || 8080, () => console.log(`Server running at http://localhost:${PORT}`));
>>>>>>> c17502119cbef038fefe8d19bec6eb226742468d

module.exports = app;
