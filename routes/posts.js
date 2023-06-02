const express = require("express")
const router = express.Router()
const upload = require("../middleware/multer")
const postsController = require("../controllers/posts")

router.post("/createPost", upload.single("file"), postsController.createPost)

module.exports = router