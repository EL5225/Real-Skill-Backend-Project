require("dotenv").config();
const { PORT } = process.env;

const express = require("express");
const cors = require("cors");
const router = require("./routes");
const {
  notFoundHandler,
  internalErrorHandler,
} = require("./middlewares/error");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Hello from server!",
  });
});

// Routes
app.use("/api", router);

// Middlewares errors
app.use(notFoundHandler);
app.use(internalErrorHandler);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
