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
  addButtons(document, new_str=null) {
    if (new_str===null) {
      new_str = `
          <li>
            <a href="/characters" class="btn btn-default btn-lg"><span class="network-name">Characters</span></a>
          </li>
          <li>
            <a href="#loginModal" class="btn btn-default btn-lg" name="profile_link" data-toggle="modal"><span class="network-name">Profile</span></a>
          </li>
          <li>
            <a href="/game" class="btn btn-default btn-lg"><span class="network-name">Play</span></a>
          </li>
        `;
    } 
    const u = document.getElementsByClassName('list-inline');
    for (var i = 0; i < u.length; i++) {
        u[i].innerHTML = new_str;
    } 
  }
  addFilters(document) {
    this._addFilter(document, "race");
    this._addFilter(document, "game");
    this._addFilter(document, "type");
  }
  _addFilter(document, type) {
    var new_str, id;
    switch (type){
      case "race": // ` is "grave accent" --> javascript "template literal"
        new_str = `
          <select id="race_selector" name=${type} size="7" form="filtersForm">
            <option value="Elf">Elf</option>
            <option value="Gnome">Gnome</option>
            <option value="Half-Elf">Half-Elf</option>
            <option value="Half-Orc">Half-Orc</option>
            <option value="Halfling">Halfling</option>
            <option value="Human">Human</option>
            <option value="Tiefling">Tiefling</option>            
          </select>
        `
        id = "raceFilter";
        break;
      case "game": 
        new_str = `
          <select id="game_selector" name=${type} size="7" form="filtersForm" autofocus>
            <option value="Saltmarsh">Saltmarsh</option>
          </select>
        `
        id = "gameFilter";
        break;
      case "type": 
        new_str = `
          <select id="type_selector" name=${type} size="7" form="filtersForm">
            <option value="pc">pc</option>
            <option value="npc">npc</option>
          </select>
        `
        id = "typeFilter";
        break;
      default:
        console.log("Invalid type: " + type);
        break;
    }
    document.getElementById(id).innerHTML = new_str;
  }
  addLogin(document) {
    const new_str = `
      <div id="loginModal" class="modal fade">
        <div class="modal-dialog modal-login">
          <div class="modal-content">
            <form id="loginForm" action="" method="get">
              <div class="modal-header">				
                <h4 class="modal-title">Login</h4>
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div class="modal-body">				
                <div class="form-group">
                  <label>Username</label>
                  <input type="text" class="form-control text-input" required="required" name="uid">
                </div>
                <div class="form-group">
                  <div class="clearfix">
                    <label>Password</label>
                  </div>
                  <input type="password" class="form-control text-input" required="required" name="pw">
                </div>
              </div>
              <div class="modal-footer" width="inherit">
                <div>
                    <label for="remember" class="checkbox-label">Remember me</label>
                    <input type="checkbox" name="remember" class="checkbox">
                </div>
                <div>
                    <a href="/signup" class="text-muted"><small>Create New Account</small></a>
                </div>
                <input type="submit" class="btn btn-primary" value="Login" onclick="client.startSession">
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    document.getElementById('loginDiv').innerHTML = new_str;    
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
            <li><a href="#loginModal" name="profile_link" data-toggle="modal">Profile</a></li>
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
  loader.addLogin(document);
});
