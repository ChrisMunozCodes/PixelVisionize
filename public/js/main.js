const { generateImage } = require("../../controllers/openaiController");

function onsubmit(e){
    e.preventDefault();

    const prompt = document.querySelector('#prompt').value;
    const size = document.querySelector('#size').value;

    if(prompt === ''){
        alert('Please add some text');
        return;
    }

    generateImageRequest(prompt, size);
}


document.querySelector('#image-form').addEventListener('submit', onsubmit);

