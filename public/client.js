// client-side javascript
class Client {
  constructor() {
    this.characters = {
      list: document.getElementById("characters"),
      form: document.querySelector("form")
    }
  }
}

// a helper function that creates a list item for a given dream
function appendNewCharacter(character) {
  const newListItem = document.createElement("li");
  newListItem.innerText = character;
  charactersList.appendChild(newListItem);
}

// fetch the initial list of docs
fetch("/mongo/characters")
  .then(response => response.json()) // parse the JSON from the server
  .then(characters => {
    // remove the loading text
    charactersList.firstElementChild.remove();

    // iterate through every dream and add it to our page
    characters.forEach(appendNewCharacter);

    // listen for the form to be submitted and add a new dream when it is
    charactersForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      // get dream value and add it to the list
      let newCharacter = charactersForm.elements.new_character.value;
      characters.push(newCharacter);
      appendNewCharacter(newCharacter);

      // reset form
      charactersForm.reset();
      charactersForm.elements.new_character.focus();
    });
  });
