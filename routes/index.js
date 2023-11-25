const { Router } = require("express");
const auth = require("./auth");
const user = require("./user");

const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../docs/swagger.json");
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Hello from API!",
  });
});

router.use("/auth", auth);
router.use("/user", user);

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs), { customCssUrl: CSS_URL });

module.exports = router;
