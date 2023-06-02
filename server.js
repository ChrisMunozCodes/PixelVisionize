const express = require("express")
const app = express()
const mongoose = require("mongoose")
const session = require("express-session")
// const MongoStore = require("connect-mongo")(session)
const connectDB = require("./config/database")
const openaiRoutes = require("./routes/openaiRoutes")
const postRoutes = require("./routes/posts")

require("dotenv").config({ path: "./config/.env" })

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static("public"))


// app.use(
//     session({
//         secret: "keyboard cat",
//         resave: false,
//         saveUninitialized: false,
//         store: new MongoStore({ mongooseConnection: mongoose.connection})
//     })
// )

app.use('/openai', openaiRoutes)
app.use("/post", postRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})