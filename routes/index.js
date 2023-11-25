const { Router } = require("express");
const auth = require("./auth");
const user = require("./user");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Hello from API!",
  });
});

router.use("/auth", auth);
router.use("/user", user);

module.exports = router;
