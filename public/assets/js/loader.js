class Loader {
  constructor() {}
  addBanner(document) {
    const new_str = `
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="intro-message">
              <h1>ZMAP 5e Campaign</h1>
              <h3>Saltmarsh: Dead Men Tell No Tales</h3>
              <hr class="intro-divider" />
                <ul class="list-inline"></ul>
            </div>
          </div>
        </div>
      </div>
      `;
    // console.log("Writing new Banner HTML:");
    // console.log(new_str);
    document.getElementById("about").innerHTML = new_str;
    
  }
  addButtons(document) {
    const new_str = `
      <li>
        <a href="https://zmap-game.glitch.me/characters" class="btn btn-default btn-lg"><span class="network-name">Characters</span></a>
      </li>
      <li>
        <a href="https://zmap-game.glitch.me/profile/login" class="btn btn-default btn-lg"><span class="network-name">Profile</span></a                  >
      </li>
      <li>
        <a href="https://zmap-game.glitch.me/game" class="btn btn-default btn-lg"><span class="network-name">Play</span></a>
      </li>
    `;
    const u = document.getElementsByClassName('list-inline');
    for (var i = 0; i < u.length; i++) {
      u[i].innerHTML = new_str;
    } 
  }
  addNavigation(document) {
    const new_str = `
      <div class="container topnav">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span> <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand topnav" href="https://zmap-game.glitch.me/">Home</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="https://zmap-game.glitch.me/characters">Characters</a></li>
            <li><a href="https://zmap-game.glitch.me/profile/login">Profile</a></li>
            <li><a href="https://zmap-game.glitch.me/game">Play</a></li>
          </ul>
        </div>
      </div>
    `;
    const nav = document.getElementsByTagName('nav');
    for (var i = 0; i < nav.length; i++) {
      nav[i].innerHTML = new_str;
    } 
  }
}
const loader = new Loader();
$( document ).ready(e => {
  loader.addNavigation(document);
});
