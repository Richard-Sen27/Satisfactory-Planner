let data  
const headings = ['Extraction','Production','Generators','Logistic','Extra']

window.onload = function() {
    setUpWindow()
}

async function setUpWindow() {
    loadNav()
    data = await fetchData()
    loadLeftSidebar() 
    loadButtons()
    keybinds()
}

async function fetchData() {
    return (await fetch('../json/data.json')).json()
}

function loadLeftSidebar() {
    //console.log(data)
    // sidebar headings
    
    let sidebar = document.getElementById('item-menu')
    for (let i = 0; i<headings.length; i++) {
        sidebar.innerHTML += `<li id="h`+i+`"><i id="h-i`+i+`" class="bi bi-chevron-right"></i>`+headings[i]+`</li>`
        // loading subcategories
        let list = `<ul id="l-i${i}" class="items hidden">`
        
        //console.log(data.machines[0].Extraction[0].name)
        for (x in data.machines[i][headings[i]]) {
            //console.log(x +' ' + i)
            list += `
            <li class="item" onmouseenter="showPreview(this,${i},${x})" onmouseleave="hidePreview()">
                <img src="${data.machines[i][headings[i]][x].url}" alt="icon" class="machine-icon">                
                ${data.machines[i][headings[i]][x].name}
            </li>` 
        }
        list += `</ul>`
        sidebar.innerHTML += list;

        // adds machine preview
        
        let s_elements = document.getElementById(`l-i${i}`).getElementsByClassName('item')
/*
        for (let x = 0; x<s_elements.length; x++) {
            s_elements[x].onmouseover = function(i,x) {
                console.log('hello')
                console.log(data.machines[i][headings[i]][x])
               topPosition(this, data.machines[i][headings[i]][x])
            }(i,x)
            //continue
        }
*/
    }// for i in headings end

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
                if (toolline[x]!==tool && toolline[x].classList.contains('operating')) {
                    toolline[x].classList.remove('operating')
                }
                else {
                    tool.classList.add('operating')
                }    
            }
            
        }
    }
    
}// load left sidebar end


//---------------------------
// external functions to call
//---------------------------

function keybinds() {
    document.onkeydown = function(event) {
        let key = event.key
        //console.log(event.key)
        let f_stats = document.getElementById('factory-stats')  
        switch(key) {
            case 'Escape':    
                // leaves the factory stats              
                if (!f_stats.classList.contains('hide-page-up')) {
                    f_stats.classList.add('hide-page-up')
                }break
            case 'i':
                // enters or leaves the factory stats
                f_stats.classList.toggle('hide-page-up')
                break 
        }
    }
}

// functions for machine preveiw --------------------------------

function showPreview(element, i, x) {
    let machine = data.machines[i][headings[i]][x]
    let preveiw = document.getElementById('machine-preview')
    preveiw.querySelector('#mp-name').innerHTML = machine.name
    preveiw.querySelector('#mp-img').src = machine.url
    preveiw.querySelector('#mp-info-w').innerHTML = machine.width
    preveiw.querySelector('#mp-info-l').innerHTML = machine.length
    preveiw.querySelector('#mp-info-h').innerHTML = machine.height
    preveiw.querySelector('#mp-info-p').innerHTML = machine.power
    //preveiw.querySelector('mp-info-').innerHTML = machine

    preveiw.classList.toggle('hide-preview-left')
    preveiw.style.top = 'rem'
}
function hidePreview() {
    let preveiw = document.getElementById('machine-preview')
    preveiw.classList.toggle('hide-preview-left')
    preveiw.style.top = '0rem'
}

function machinePreviewHTML(machine) {    
    console.log(machine)
    return `
    <div class="machine-preview hidden">
        <div id="mp-name">${machine.name}</div>
        <img id="mp-img" src="${machine.url}" alt="preview">
        <div id="mp-info">
            <table>
                <tr>
                    <td>Width:</td>
                    <td><span id="mp-info-w">${machine.width}</span> m</td>
                </tr>
                <tr>
                    <td>Length: </td>
                    <td><span id="mp-info-l">${machine.length}</span> m</td>
                </tr>
                <tr>
                    <td>Height:</td>
                    <td><span id="mp-info-h">${machine.height}</span> m</td>
                </tr>
                <tr>
                    <td>Power: </td>
                    <td><span id="mp-info-p">${machine.power}</span> MW</td>
                </tr>                    
            </table>
        </div>
    </div>`
}

// machine preview end ------------------------------------------
//

// reading properties out from inputs --------------------------------------
// synchronisation of range for efficiency
function synchInValueWithAnother(idFrom,idTo) {
    document.getElementById(idTo).value = document.getElementById(idFrom).value
}

function setColor(variable, id) {
    let r = document.querySelector(':root')
    r.style.setProperty(variable, document.querySelector('#'+id).value);
}

// properties end ----------------------------------------------------------





function loadButtons() {
    //factory stats  initialisation
    document.getElementById('f-stats-btn').onclick = function() {
        popUpPage(document.getElementById('factory-stats'))
    }
 
    /* on any click toggles
    document.getElementById('factory-stats').onclick = function() {
        popUpPage(document.getElementById('factory-stats'))
    }*/
    
}
function popUpPage(element) {
    element.classList.toggle('hide-page-up')
}

// set up eventlistenr for clicking out of an element
/*
document.onclick =   function(event) {
    if (event.target !== document.getElementById('f-stats-content')
        && event.target !== document.getElementById('f-stats-btn') 
        && !document.getElementById('factory-stats').classList.contains('hide-page-up')) {
        console.log('hello')
        popUpPage(document.getElementById('factory-stats'))
    }
}
*/

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