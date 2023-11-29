const { Router } = require("express");
const auth = require("./auth");
const user = require("./user");
const general = require("./general");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Hello from API!",
  });
});

router.use("/auth", auth);
router.use("/users", user);
router.use("/generals", general);

module.exports = router;
