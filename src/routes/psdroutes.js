// DEPENDENCIES
require("dotenv").config();
const router = require("express").Router();
/* ----------------------- */
const controllers = require("../controllers/psdcontrollers");
const middleware = require("../middlewares/psdmiddlewares");
const multer = require("multer");

// USER
router.post("/upload", middleware.single("file"), controllers.maincontroller);
router.get("/psdsearch", controllers.search);
router.get("/getall", controllers.getall);
module.exports = router;
