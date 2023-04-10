//path module
const path = require('path');
//creating express server
const express = require("express");
//getting the express-fileupload middleware
const fileUpload = require("express-fileupload")
//getting the cloudinary middleware
const cloudinary = require("cloudinary").v2
//getting the file system middleware
const fs = require("fs")
const dotenv = require("dotenv").config();
//getting port value from .env or setting to 5000
const port = process.env.PORT || 5000;
//itializing express
const app = express();
//connecting to MongiDB through mongoclient's connect method
const MongoClient = require("mongodb").MongoClient
//passing the mongodb url to access database
const uri = process.env.MONGODB_URL
//connecting to Mongodb database

//passing the cloudinary information
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_COLUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.static('public'))
//Enable body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
//telling the server to access the express-fileUpload middleware and pass the arguments
app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 2024 * 1024 }
}))

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// establishing route
app.use("/openai", require("./routes/openaiRoutes"));

//display homepage
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
//setting the MIME type fro the main.js file explicitly in the server code
app.get('/public/main.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/public/main.js')
})


MongoClient.connect(uri, { useUnifiedTopology: true })
    .then((client) => {
        console.log("Connected to Database")
        //connect to project named pictureTest
        const db = client.db("pictureTest")
        //connect to collection with name imaSrc
        const imageInfo = db.collection("imgSrc")

        //making a post request to Cloudinary and MongoDB
        app.post("/sendInfo", async (req, res) => {
        //accessing the images that are stored inside the public/images folder
            fs.readdir("public/images", async (err, files) => {
                if (err) throw err
        //sorting the images to retrive the most recent entry
                files.sort((a, b) => {
                    return (
                        fs.statSync(`public/images/${b}`).mtime.getTime() -
                        fs.statSync(`public/images/${a}`).mtime.getTime()
                    )
                })
        //if no images found return error
                if (files.length === 0) {
                    return res.status(400).json({ error: "No image found in images folder" })
                }
        //passing the most recent image and uploading it to cloudinary
                const result = await cloudinary.uploader.upload(`public/images/${files[0]}`, {
                    public_id: `${Date.now()}`,
                    resource_type: "auto",
                    folder: "images"
                })
                console.log(result.url)
        //once the image is inside cloudinary, we are retriving the url and storing it in mongoDB
                imageInfo.insertOne({ src: result.url })
                    .then((result) => {
                        console.log(result);
                        res.json({ message: "Image source saved successfully!" })
                    })
                    .catch((error => console.error(error)))
            })


        })

    })
    .catch((error) => console.error(error))



//passing port to test server
app.listen(port, () => console.log(`Server started on port ${port}`));




