const { Router } = require("express");
const auth = require("./auth");
const user = require("./user");
const profile = require("./profile");
const general = require("./general");
const course = require("./class");

const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Hello from API!",
  });
});

router.use("/auth", auth);
router.use("/users", user);
router.use("/profiles", profile);
router.use("/general", general);
router.use("/classes", course);

module.exports = router;
