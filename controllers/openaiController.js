const generateImage = async (req, res) => {
  // this code block is being used as a test with POSTMAN to verify connection.
  res.status(200).json({
    success: true,
  });
};

module.exports = {generateImage};
