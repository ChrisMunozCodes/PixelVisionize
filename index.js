//path module
const path = require('path');

//creating express server
const express = require("express");
//calling the .env environment
const dotenv = require("dotenv").config();
//getting port value from .env or setting to 5000
const port = process.env.PORT || 5000;
//adding the middleware body-parser
const bodyParser = require("body-parser")
//itializing express
const app = express();
//connecting to MongiDB through mongoclient's connect method
const MongoClient = require("mongodb").MongoClient
//passing the mongodb url to access database
const uri = process.env.MONGODB_URL
//connecting to Mongodb database
MongoClient.connect(uri, {useUnifiedTopology: true})
    .then((client)=> {
        console.log("Connected to Database")
        //connect to project named pictureTest
        const db = client.db("pictureTest")
        //connect to collection with name imaSrc
        const imageInfo = db.collection("imgSrc")

        app.use(express.static('public'))
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}))

        //Enable body parser
        app.use(express.json());
        app.use(express.urlencoded({extended: false}))

        //Set static folder
        app.use(express.static(path.join(__dirname, 'public')));

        // establishing route
        app.use("/openai", require("./routes/openaiRoutes"));

        //display homepage
        app.get("/", (req,res) => {
            res.sendFile(__dirname + "/index.html")
        })
        //setting the MIME type fro the main.js file explicitly in the server code
        app.get('/public/main.js', (req, res) => {
            res.set('Content-Type', 'application/javascript');
            res.sendFile(__dirname + '/public/main.js')
        })
        //making a post request to MongoDB with the src value of the image
        app.post("/sendInfo", (req, res) => {
            imageInfo.insertOne({src: req.body.src})
            .then((result) => {
                console.log(result);
                res.json({message: "Image source saved successfully!"})
            })
            .catch((error => console.error(error)))
        })
        //passing port to test server
        app.listen(port, () => console.log(`Server started on port ${port}`));

    })
    .catch((error) => console.error(error))



