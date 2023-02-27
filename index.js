//creating the path module
const path = require('path')

//creating express server
const express = require("express");
//calling the .env environment
const dotenv = require("dotenv").config();
//getting port value from .env or setting to 5000
const port = process.env.PORT || 5000;
//itializing express
const app = express();

// Enable body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}))

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// establishing route
app.use("/openai", require("./routes/openaiRoutes"));

//passing port to test server

app.listen(port, () => console.log(`Server started on port ${port}`));
