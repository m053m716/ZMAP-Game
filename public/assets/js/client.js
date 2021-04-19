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
  uri(route) {
    const full_uri = this.base_uri + route; 
    return full_uri;
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
  async startSession(e) { // attempt to start client session on login
    e.preventDefault();
    const url = this.uri('/login');
    console.log(url);
    const hash = await Client.digestMessage(e.submitter.form.elements.pw.value)
    console.log(hash);
    Client.postData(url, { uname: e.submitter.form.elements.uname.value, pw: hash })
      .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
      });
  }
  static async digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
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
    // console.log(response);
    return response.json(); // parses JSON response into native JavaScript objects
  }
  static async getData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
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
    console.log(response);
    return response.json(); // parses JSON response into native JavaScript objects
  }
};
  
const client = new Client(document);