function onsubmit(e){
    e.preventDefault();
    //clearing the dom from any past images and messages and icons
    document.querySelector('.msg').textContent = '';
    document.querySelector('#image').src = ''
    document.querySelector('.resultsOptions').innerHTML = "";

    const prompt = document.querySelector('#prompt').value;
    const size = document.querySelector('#size').value;

    if(prompt === ''){
        alert('Please add some text');
        return;
    }

    generateImageRequest(prompt, size);
}
//creating async function to take and generate image request
async function generateImageRequest(prompt, size){
    //sending out the fetch request data and retriving data
    try{
        showSpinner();

        const response = await fetch('/openai/generateimage', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify({
            prompt,
            size
        })
    });
    // throwing error message to DOM
    if(!response.ok){
        removeSpinner();
        throw new Error('That image could not be generated')
    }
    // if response it good.
    const data = await response.json();
    //saving image url to a variable
    const imageUrl = data.data;
    //display image url in the dom
    document.querySelector('#image').src = imageUrl;
    //insert and display star icons to DOM
    document.querySelector('.resultsOptions').innerHTML = '<i class="fa-regular fa-star unlock"></i>' + '<i class="fa-solid fa-star lock"></i>'
    removeSpinner();
    }catch(error){
        document.querySelector('.msg').textContent = error;
    }
}

//function to show spinner to DOM
function showSpinner(){
    document.querySelector('.spinner').classList.add('show');
}
//function to remove spinner from DOM
function removeSpinner(){
    document.querySelector('.spinner').classList.remove('show');
}
//adding event listener to submit button to trigger onsubmit function
document.querySelector('#image-form').addEventListener('submit', onsubmit);

//when generate button is clicked, toggles the hidden-image class to show the section where the image will be
document.querySelector('.btn').addEventListener('click', toggleHidden)

function toggleHidden() {
    document.querySelector('.image').classList.toggle('hidden-toggle')
} 




