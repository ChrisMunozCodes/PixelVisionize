document.getElementById("likebutton").addEventListener("click", sendInfo);
document.getElementById("likebutton").addEventListener("touchstart", sendInfo);
let likebuttonCount = 0;
function onsubmit(e) {
  e.preventDefault();
  //clearing the dom from any past images and messages and icons
  document.querySelector(".msg").textContent = "";
  document.querySelector("#image").src = "";
  document.querySelector(".resultsOptions").innerHTML = "";

  const prompt = document.querySelector("#prompt").value;
  const size = '256x256'


  if (prompt === "") {
    alert("Please add some text");
    return;
  }

  generateImageRequest(prompt, size);
}
//creating async function to take and generate image request
async function generateImageRequest(prompt, size) {
  //sending out the fetch request data and retriving data
  try {
    showSpinner();

    const response = await fetch("/openai/generateimage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        size,
      }),
    });
    // throwing error message to DOM
    if (!response.ok) {
      removeSpinner();
      throw new Error("That image could not be generated");
    }
    // if response it good.
    const data = await response.json();
    //saving image url to a variable
    const imageUrl = data.data;
    //display image url in the dom
    document.querySelector("#image").src = imageUrl;
    //insert and display star icons to DOM
    document.querySelector(".resultsOptions").innerHTML =
      '<i class="fa-regular fa-star unlock"></i>' +
      '<i class="fa-solid fa-star lock"></i>';
    removeSpinner();
  } catch (error) {
    document.querySelector(".msg").textContent = error;
  }
}

//function to show spinner to DOM
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
//function to remove spinner from DOM
function removeSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}
//adding event listener to submit button to trigger onsubmit function
document.querySelector("#image-form").addEventListener("submit", onsubmit);

//when generate button is clicked, toggles the hidden-image class to show the section where the image will be
document.querySelector(".btn").addEventListener("click", toggleHidden);

function toggleHidden() {
  if (
    document
      .querySelector("#toggle-hidden-section")
      .classList.contains("hidden-toggle")
  ) {
    document.querySelector(".image").classList.toggle("hidden-toggle");
  }
}

// asynce function that will issue a fetch requet that will send it to server.js with the post method
async function sendInfo() {
  if (likebuttonCount === 0) {
    const imgSrc = document.getElementById("image").getAttribute("src");
    try {
      const response = await fetch("/sendInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          src: imgSrc,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }
  likebuttonCount = +1
}

//
// Code for the suggestion dropdown UI functionality. 

// Note: Inside style CSS the class "suggestion-shown" has a rule that looks for an element with "suggestion-shown" that also has the class="suggestion-container". If the element contains
// suggestion-container but not suggestion-shown, display: none.

// That way we can look for what category the user has selected, and show only the relevant buttons.
//

const dropdowns = document.querySelectorAll('.dropdown');
const suggestionContainer = document.querySelector('.suggestion-container');

// Add suggestion-shown class to suggestionContainer element
suggestionContainer.classList.add('suggestion-shown');

// For each dropdown, add a click event listener
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener('click', () => {
    // Get the next sibling element of the dropdown
    const submenu = dropdown.nextElementSibling;
    // Get the parent element of the dropdown
    const parent = dropdown.parentNode;
    // Toggle the class 'active' on the parent element
    parent.classList.toggle('active');

    if (submenu.style.maxHeight) {
      // close submenu
      submenu.style.maxHeight = null;
      suggestionContainer.classList.remove('suggestion-shown');
    } else {
      // open submenu
      // Setting the max height of the dropdown ui to its scroll height, "opening" the menu.
      submenu.style.maxHeight = submenu.scrollHeight + 'px';
      suggestionContainer.classList.add('suggestion-shown');

      const activeDropdown = document.querySelector('.active .dropdown');
      const lightingSelected = document.querySelector('.lighting-click.selected');
      const moodSelected = document.querySelector('.mood-click.selected');


      // If there is an active dropdown and either lightingSelected or moodSelected is selected
      if (activeDropdown && (lightingSelected || moodSelected)) {
        // Get the element with class 'suggestion-style'
        const styleSuggestions = document.querySelector('.suggestion-style');
        // Remove the class 'suggestion-shown' from styleSuggestions
        styleSuggestions.classList.remove('suggestion-shown');
      }
    }
  });
});

const promptSuggestionsText = document.querySelector('.prompt-suggestions-text');
if (promptSuggestionsText) {
  promptSuggestionsText.addEventListener('click', () => {
    const activeDropdown = document.querySelector('.active .dropdown');
    if (activeDropdown) {
      // close active dropdown
      const submenu = activeDropdown.nextElementSibling;
      submenu.style.maxHeight = null;
      activeDropdown.parentNode.classList.remove('active');
    }

    suggestionContainer.classList.toggle('suggestion-shown');
  });
}

// These variables control the cosmetic css properties, .selected turns the suggestion categories red with a white dotted border.
const style = document.querySelector('.style-click');
const lighting = document.querySelector('.lighting-click');
const mood = document.querySelector('.mood-click');

// These variables control the act of tracking which category is selected and only showing the correct buttons, and hiding the others.
const styleSuggestions = document.querySelector('.suggestion-style');
const lightingSuggestions = document.querySelector('.suggestion-lighting');
const moodSuggestions = document.querySelector('.suggestion-mood');

if (style) {
  style.addEventListener('click', function () {
    this.classList.add('selected');
    if (lighting) {
      lighting.classList.remove('selected');
    }
    if (mood) {
      mood.classList.remove('selected');
    }
    styleSuggestions.classList.add('suggestion-shown');
    lightingSuggestions.classList.remove('suggestion-shown');
    moodSuggestions.classList.remove('suggestion-shown');
  });
}

if (lighting) {
  lighting.addEventListener('click', function () {
    this.classList.add('selected');
    if (style) {
      style.classList.remove('selected');
    }
    if (mood) {
      mood.classList.remove('selected');
    }
    styleSuggestions.classList.remove('suggestion-shown');
    lightingSuggestions.classList.add('suggestion-shown');
    moodSuggestions.classList.remove('suggestion-shown');
  });
}

if (mood) {
  mood.addEventListener('click', function () {
    this.classList.add('selected');
    if (style) {
      style.classList.remove('selected');
    }
    if (lighting) {
      lighting.classList.remove('selected');
    }
    styleSuggestions.classList.remove('suggestion-shown');
    lightingSuggestions.classList.remove('suggestion-shown');
    moodSuggestions.classList.add('suggestion-shown');
  });
}
//
