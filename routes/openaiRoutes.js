// bring in express technology
const express = require("express");
// bring in our function via destructuring
const {generateImage} = require("../controllers/openaiController");
const router = express.Router();

// the block of code below was used as a test with POSTMAN in order to verify connection

// router.post("/generateimage", (req, res) => {
//   res.status(200).json({
//     success: true,
//   });
// });

router.post("/generateimage", generateImage);

module.exports = router;
