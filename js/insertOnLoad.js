window.onload = function() {
    loadElements()
}

function loadElements() {
    loadNav()
    loadFooter()    
}

function loadNav() {
    document.getElementById('navbar').innerHTML = `
    <a class="nav-img-link" href="https://www.satisfactorygame.com/" target="_blank"><img class="nav-img" src="../img/SaFac_Banner.webp" alt="Satisfactory"></a>

    <label for="hamburger">&#9776;</label>
    <input type="checkbox" id="hamburger">            
        <div id="nav-items">
            <a class="nav-link" href="./index.html">Home</a>
            <a class="nav-link" href="./items.html">Items</a>
            <a class="nav-link" href="./planning.html" target="_blank">Planner</a>
            <button class="dropbtn nav-link" onclick="myFunction()">Game Info
                <i class="fa fa-caret-down"></i>
            </button>
            <div class="dropdown-content" id="myDropdown">
                <a class="drop-link" href="./about.html">About the Game</a>
                <a class="drop-link" href="./history.html">Update History</a>
            </div>
            <a class="nav-link" href="https://satisfactory-calculator.com/" target="_blank">Calculator</a>
            <a class="nav-link" href="https://satisfactory.fandom.com/wiki/Satisfactory_Wiki" target="_blank">Wiki</a>
        </div>       `;
}

function loadFooter() {
    document.getElementById('footer').innerHTML = `
    <div>
        <p>All Satisfactory Icons belong to Coffee Stain Studios</p>
        <p>© Richard Senger, 2022 - 2023 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a class="imp-link" href="./impressum.html">Impressum</a></p>           
    </div>`;
}