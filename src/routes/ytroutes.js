// DEPENDENCIES
require("dotenv").config();
const router = require("express").Router();
/* ----------------------- */
const controllers = require("../controllers/ytcontrollers");

// USER
router.get("/", controllers.main);
router.get("/data", controllers.data);
router.get("/ytsearch", controllers.search);

module.exports = router;
