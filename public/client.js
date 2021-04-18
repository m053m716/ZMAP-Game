// client-side javascript
class Client {
  constructor(document) {
    this.document = document;
    this.characters = {
      list: document.getElementById("characters"),
      form: document.querySelector("form")
    }
    this.flags = {
      new: true
    }
  }
  appendCharacter(character) {
    const newListItem = this.document.createElement("li");
    newListItem.innerText = character;
    this.characters.list.appendChild(newListItem);
  }
  filterCharacters(query) {
    // fetch the initial list of docs
    fetch("/mongo/characters")
      .then(response => response.json()) // parse the JSON from the server
      .then(characters => {
        // remove the loading text
        if (this.flags.new) {
          this.characters.list.firstElementChild.remove();
          this.flags.new = false;
        }

        // iterate through every dream and add it to our page
        characters.forEach(ch => this.appendCharacter(ch));

        // listen for the form to be submitted and add a new dream when it is
        this.characters.form.addEventListener("submit", event => {
          // stop our form submission from refreshing the page
          event.preventDefault();

          // get dream value and add it to the list
          let newCharacter = this.characters.form.elements.new_character.value;
          characters.push(newCharacter);
          this.appendCharacter(newCharacter);

          // reset form
          this.characters.form.reset();
          this.characters.form.elements.new_character.focus();
        });
      });
  }
}
const client = new Client(document);