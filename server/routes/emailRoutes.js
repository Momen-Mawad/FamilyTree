const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/emailController");

router.post("/contactForm", controller.contactForm);

module.exports = router;
