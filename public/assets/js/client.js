// client-side javascript
class Client {
  constructor(document, formatter) {
    this.base_uri = 'https://zmap-game.glitch.me';
    this.document = document;
    this.filters = null;
    this.characters = null;
    this.flags = {
      new: true
    }
  }
  uri(route = '') {
    return this.base_uri + route; 
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
  static async digestMessage(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest('SHA-512', data);
    return hash;
  }
  startSession(e) { // attempt to start client session on login
    e.preventDefault();
    const hash = Client.digestMessage(e.submitter.form.elements.pw.value);
    Client.postData(this.uri('/login'), { uname: e.submitter.form.elements.uname.value, pw: hash })
      .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
      });
  }
  static async postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
};
  
const client = new Client(document);