const express = require("express");
const router = express.Router();
const { addDevice, getDevices } = require("../controllers/deviceController");

router.post("/add", addDevice);
router.get("/", getDevices);

module.exports = router;
