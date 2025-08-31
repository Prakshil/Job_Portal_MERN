const express = require("express");
const {
  register,
  login,
  profile,
  logout,
} = require("../controllers/usercontroller");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", auth, profile);

module.exports = router;
