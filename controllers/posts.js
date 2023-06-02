const cloudinary = require("../middleware/cloudinary")
const Post = require("../models/Post")
const fs = require("fs")

module.exports = {
    createPost: async (req, res) => {
        fs.readdir("public/images", async(err, files) => {
            if(err) throw err
            files.sort((a, b) => {
                return (
                    fs.statSync(`Public/images/${b}`).mtime.getTime() - 
                    fs.statSync(`Public/images/${a}`).mtime.getTime()
                )

            })
            if(files.length === 0){
                return res.status(400).json({ error: "No image found in images folder"})
            }

            const result = await cloudinary.uploader.upload(`public/images/${files[0]}`,{
                public_id: `${Date.now()}`,
                resource_type:"auto",
                folder: "images"
            })
            console.log("Post has been added!")
            res.redirect("/index")
        })
        // try{
        //     const result = await cloudinary.uploader.upload(req.file.path)

        //     await Post.create({
        //         image: result.secure_url,
        //         cloudinaryId: result.public_id,
        //         user: req.user.id,
        //     })
        //     console.log("Post has been added!")
        //     res.redirect("/index")
        // }catch (err){
        //     console.log(err)
        // }
    }
}