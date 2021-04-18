// client-side javascript
class Client {
  constructor(document) {
    this.document = document;
    this.filters = document.querySelector("form");
    this.characters = document.getElementById("characters");
    this.flags = {
      new: true
    }
  }
  appendCharacter(character) {
    const newListItem = this.document.createElement("li");
    newListItem.innerText = character;
    this.characters.appendChild(newListItem);
  }
  applyFilters() {
    // Get query object
    let query = {
      "game": this.filters.elements.game.value,
      "type": this.filters.elements.type.value,
      "race": this.filters.elements.race.value
    }
    
    // fetch the initial list of docs
    let u = new URLSearchParams(query).toString();
    fetch("/mongo/characters")
      .then(response => response.json()) // parse the JSON from the server
      .then(characters => {
        // remove the loading text
        if (this.flags.new) {
          this.characters.firstElementChild.remove();
          this.flags.new = false;
        }

        // iterate through every dream and add it to our page
        characters.forEach(ch => this.appendCharacter(ch));
    });
  }
};
  
const client = new Client(document);
$( document ).ready(function() {
  // listen for the form to be submitted and add a new dream when it is
  client.filters.addEventListener("submit", event => {
    // stop our form submission from refreshing the page
    event.preventDefault();
    client.applyFilters();
    // reset form
    client.filters.reset();
    client.filters.elements.game.focus();
    console.log("client-side interface is ready");
  });
});