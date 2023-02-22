let data 

window.onload = function() {
    setUpWindow()
}

async function setUpWindow() {
    loadNav()
    data = await fetchData()
    loadLeftSidebar() 
}

async function fetchData() {
    return (await fetch('../json/data.json')).json()
}

function loadLeftSidebar() {
    console.log(data)
    // sidebar headings
    const headings = ['Extraction','Production','Power','Logistic','Extra']
    let sidebar = document.getElementById('item-menu')
    for (i in headings) {
        sidebar.innerHTML += `<li id="h`+i+`"><i id="h-i`+i+`" class="bi bi-chevron-right"></i>`+headings[i]+`</li>`
        
        // loading subcategories
        let list = `<ul id="l-i${i}" class="items hidden">`
        //console.log(data.machines[0].Extraction[0].name)
        for (x in data.machines[i][headings[i]]) {
            console.log(x +' ' + i)
            list += `<li class="item"><img src="${data.machines[i][headings[i]][x].url}" alt="icon" class="machine-icon"><div>${data.machines[i][headings[i]][x].name}</div></li>` 
        }
        list += `</ul>`
        sidebar.innerHTML += list
    }

    //loads the arrows beside the headings
    for (i in headings) {
        let e = document.getElementById('h-i'+i)
        let u = document.getElementById('l-i'+i)
        document.getElementById('h'+i).onclick = function() {
            
            if (e.classList.contains('icon-down')) {
                e.classList.replace('icon-down','icon-right')
            }
            else if (e.classList.contains('icon-right')) {
                e.classList.replace('icon-right','icon-down')
            }
            else {
                e.classList.add('icon-down')
            }    

            u.classList.toggle('hidden')
        }
    }

    // adds eventlistner to operators
    let toolline = document.getElementsByClassName('op')
    for (i in toolline) {
        let tool = toolline[i]
        tool.onclick = function() {
            for (x in toolline) {
                if (toolline[x]!=tool && toolline[x].classList.contains('operating')) {
                    toolline[x].classList.remove('operating')
                }
                else {
                    tool.classList.add('operating')
                }    
            }
            
        }
    }
    
}


function loadNav() {
    document.getElementById('navbar').innerHTML = 
    `<a class="nav-img-link" href="https://www.satisfactorygame.com/" target="_blank"><img class="nav-img" src="../img/SaFac_Banner.webp" alt="Satisfactory"></a>

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
        </div>       `

}