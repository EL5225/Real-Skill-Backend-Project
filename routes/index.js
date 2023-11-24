const { Router } = require("express");
const auth = require("./auth");
const user = require("./user");

const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../docs/swagger.json");

const router = Router();

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end("<p>Hello from API!</p>");
});

router.use("/auth", auth);
router.use("/user", user);

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = router;
