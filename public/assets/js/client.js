// client-side javascript
class Client {
  constructor(document, formatter) {
    this.document = document;
    this.filters = null;
    this.characters = null;
    this.flags = {
      new: true
    }
  }
  setupCharacters() {
    this.filters = document.getElementById("filtersForm");
    this.characters = document.getElementById("characters");
    this.filters.addEventListener("submit", event => {
      event.preventDefault();
      client.applyFilters();
    })
  }
  appendCharacter(character) {
    const newListItem = this.document.createElement("li");
    newListItem.innerText = character;
    this.characters.appendChild(newListItem);
  }
  static _formatCharacters(data) {
    const characters_list = [];
    data.forEach(character => {
      characters_list.push(
        "" + character.name.first + " " + character.name.last + ": " + character.about
      );
    });
    return characters_list
  }
  applyFilters() {
    // Get query object
    let query = {
      "type": this.filters.elements.type.value,
      "race": this.filters.elements.race.value
    }
    
    // fetch the initial list of docs
    let u = new URLSearchParams(query).toString();
    fetch("/mongo/characters?" + u)
      .then(response => response.json()) // parse the JSON from the server
      .then(data => {
        // remove the loading text
        var child = this.characters.lastElementChild; 
        while (child) {
            this.characters.removeChild(child);
            child = this.characters.lastElementChild;
        }
        // format the data
        let characters = Client._formatCharacters(data);
        characters.forEach(ch => this.appendCharacter(ch));
    });
  }
  startSession(e) { // attempt to start client session on login
    e.preventDefault();
    console.log(e.);
  }
};
  
const client = new Client(document);