class Loader {
  constructor() {}
  addBanner(div) {
    div.innerHTML = `
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <h2>Join</h2>
          </div>
          <div class="col-lg-6">
            <ul class="list-inline banner-social-buttons">
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
      </div>`;
  }
}
const loader = Loader();
