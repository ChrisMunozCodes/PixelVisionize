const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs/promises")
const path = require("path")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // passing in the open ai key
});
const openai = new OpenAIApi(configuration);

const generateImage = async (req, res) => {
  // this code block is being used as a test with POSTMAN to verify connection.

  //reciving a prompt and size
  const {prompt, size} = req.body;

  const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

  try {
    const response = await openai.createImage({

      prompt, // prompt for image generation
      n: 1, // number of images returned
      size: imageSize, // size of image
      response_format: 'b64_json',
    });

    const imageUrl = response.data.data[0].b64_json

    const imagesDir = path.join(__dirname, "../public/images")
    await fs.mkdir(imagesDir, {recursive:true})

    const timestamp = Date.now()
    const fileName = `${timestamp}.png`
    const imagePath = path.join(imagesDir, fileName)

    await fs.writeFile(imagePath, Buffer.from(imageUrl, "base64"))

    res.status(200).json({
      success: true,
      data: `images/${fileName}`
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    
    res.status(400).json({
      success: false,
      error: 'The image could not be generated' //error message
    });
  }
};

module.exports = {generateImage};
