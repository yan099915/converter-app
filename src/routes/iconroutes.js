// DEPENDENCIES
require("dotenv").config();
const router = require("express").Router();
/* ----------------------- */
const controllers = require("../controllers/iconcontrollers");

// USER
router.get("/iconsearch", controllers.search);

module.exports = router;
