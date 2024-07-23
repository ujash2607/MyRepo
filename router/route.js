const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

router.get('/getUser', controller.getUser);
router.get('/userById/:id', controller.userById);
router.get('/cities', controller.uniqueCity);
router.post('/addData', controller.addData);

module.exports = router;