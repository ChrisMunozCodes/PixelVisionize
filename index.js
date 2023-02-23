//creating express server
const express = require("express");
//calling the .env environment
const dotenv = require("dotenv").config();
//getting port value from .env or setting to 5000
const port = process.env.PORT || 5000;
//itializing express
const app = express();

//passing port to test server
// testing comment
// x2
app.listen(port, () => console.log(`Server started on port ${port}`));
