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
        <a href="#loginModal" class="btn btn-default btn-lg" name="profile_link" data-toggle="modal"><span class="network-name">Profile</span></a>
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
  addFilter(document, type) {
    var new_str, id;
    switch (type){
      case "race":
        new_str = `
          <select id="race_selector" name="race" required>
            <option value="Elf">Elf</option>
            <option value="Gnome">Gnome</option>
            <option value="Half-Elf">Half-Elf</option>
            <option value="Half-Orc">Half-Orc</option>
            <option value="Halfling">Halfling</option>
            <option value="Human">Human</option>
            
            
          </select>
          <input name="race" type="text" maxlength="100" required placeholder="(e.g. halfling)">
        `
        break;
      case "game": 
        break;
      case "type": 
        break;
    }
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
                  <input type="text" class="form-control" required="required" name="uid">
                </div>
                <div class="form-group">
                  <div class="clearfix">
                    <label>Password</label>
                    <a href="#" class="float-right text-muted"><small>Forgot?</small></a>
                  </div>

                  <input type="password" class="form-control" required="required" name="pw">
                </div>
              </div>
              <div class="modal-footer justify-content-between">
                <label class="form-check-label"><input type="checkbox" name="remember"> Remember me</label>
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
