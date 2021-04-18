// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("Hello (client) world!");

// define variables that reference elements on our page
const charactersList = document.getElementById("characters");
const charactersForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function appendNewDocument(doc) {
  const newListItem = document.createElement("li");
  newListItem.innerText = doc;
  docsList.appendChild(newListItem);
}

// fetch the initial list of docs
fetch("/mongo/characters")
  .then(response => response.json()) // parse the JSON from the server
  .then(docs => {
    // remove the loading text
    docsList.firstElementChild.remove();

    // iterate through every dream and add it to our page
    docs.forEach(appendNewDocument);

    // listen for the form to be submitted and add a new dream when it is
    docsForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      // get dream value and add it to the list
      let newDoc = docsForm.elements.new_doc.value;
      docs.push(newDoc);
      appendNewDocument(newDoc);

      // reset form
      docsForm.reset();
      docsForm.elements.new_doc.focus();
    });
  });
