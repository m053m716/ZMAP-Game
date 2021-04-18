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
                <ul class="list-inline intro-social-buttons">
                  <li>
                    <a href="https://zmap-game.glitch.me/characters" class="btn btn-default btn-lg"><span class="network-name">Characters</span></a>
                  </li>
                  <li>
                    <a href="https://zmap-game.glitch.me/profile/login" class="btn btn-default btn-lg"><span class="network-name">Profile</span></a                  >
                  </li>
                  <li>
                    <a href="https://zmap-game.glitch.me/game" class="btn btn-default btn-lg"><span class="network-name">Play</span></a>
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
      `;
    console.log("Writing new Banner HTML:");
    console.log(new_str);
    document.getElementById("about").innerHTML = new_str;
  }
}
const loader = new Loader();
