const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // passing in the open ai key
});
const openai = new OpenAIApi(configuration);

const generateImage = async (req, res) => {
  // this code block is being used as a test with POSTMAN to verify connection.
  try {
    const response = await openai.createImage({
      prompt: 'Polar bear on ice skates', // prompt for image generation
      n: 1, // number of images returned
      size: '512x512' // size of image
    });

    const imageUrl = response.data.data[0].url

    res.status(200).json({
      success: true,
      data: imageUrl
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
