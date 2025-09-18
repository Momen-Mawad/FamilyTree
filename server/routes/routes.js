const router = require("express").Router();
const controller = require("../controllers/controllers");

// Person routes
router.post("/persons", controller.createPerson);
router.get("/persons", controller.getAllPersons);
router.get("/persons/:id", controller.getPerson);
router.put("/persons/:id", controller.updatePerson);
router.delete("/persons/:id", controller.deletePerson);

// Family routes
router.post("/families", controller.createFamily);
router.get("/families", controller.getAllFamilies);
router.get("/families/:id", controller.getFamily);
router.put("/families/:id", controller.updateFamily);
router.delete("/families/:id", controller.deleteFamily);

// Auth routes
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/verify_token", controller.verify_token);

module.exports = router;
