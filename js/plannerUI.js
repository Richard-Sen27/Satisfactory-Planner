let data  
const headings = ['Extraction','Production','Generators','Logistic','Extra']
let buildings = []
let maxId = 0
let maxPortId = 0
let operation = 'move'
let mouseX
let mouseY
let setKeybinds = false
let changeSetting = -1

let fromPort = null
let toPort = null

let settings_Key = ['1','2','3','4','Escape','f','Delete','w','s','a','d']
let settings_Name = ['Tool: Move', 'Tool: Select', 'Tool: Add', 'Tool: Delete', 'Open/Close Settings', 'Open/Close Factory Stats', 'Delete selected Building','Up','Down','Left','Right']

window.onload = function() {
    setUpWindow()
    synchPowerIndicator()
}

async function setUpWindow() {
    loadNav()
    data = await fetchData()
    loadLeftSidebar() 
    loadButtons()
    keybinds()
    setupKeybindSettings()
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
            <li class="item" onmouseenter="showPreview(this,${i},${x})" onmouseleave="hidePreview()" onclick="addBuilding(${i},${x})">
                <img src="${data.machines[i][headings[i]][x].url}" alt="icon" class="machine-icon">                
                ${data.machines[i][headings[i]][x].name}
            </li>` 
        }
        list += `</ul>`
        sidebar.innerHTML += list;
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

}// load left sidebar end


//---------------------------
// external functions to call
//---------------------------

function keybinds() {
    document.onkeydown = function(event) {
        let key = event.key
        //console.log(event.key)
        if (!setKeybinds) {
            let f_stats = document.getElementById('factory-stats')  
            let settings_w = document.getElementById('settings-window')
            switch(key) {
                case settings_Key[0]:    
                    setOperation('move')
                    break
                
                case settings_Key[1]:    
                    setOperation('select')
                    break

                case settings_Key[2]: 
                    setOperation('add')
                    break

                case settings_Key[3]:     
                    setOperation('delete')
                    break
                case settings_Key[4]:    
                    // leaves the factory stats
                    if (fromPort == null && toPort == null){              
                        if (f_stats.classList.contains('hide-page-up')) {
                            toggleSettingsWindow()
                        }
                        if (!f_stats.classList.contains('hide-page-up')) {
                            f_stats.classList.add('hide-page-up')
                        }                    
                    }
                    else {
                        fromPort = null
                        toPort = null
                        document.getElementById('previewLine').style.display = 'none'
                    }
                    break

                case settings_Key[5]:
                    // enters or leaves the factory stats
                    if (settings_w.classList.contains('hide-page-up')){
                        f_stats.classList.toggle('hide-page-up')
                    }                
                    break
                case settings_Key[6]:
                    removeBuilding()
                    let p = document.getElementById('properties')
                    if (!p.classList.contains('hide-right-smooth')) {
                        p.classList.add('hide-right-smooth')
                    }
                    break
                case settings_Key[7]:
                    moveAll(0,-5)
                    break
                case settings_Key[8]:
                    moveAll(0,5)
                    break
                case settings_Key[9]:
                    moveAll(-5,0)
                    break
                case settings_Key[10]:
                    moveAll(5,0)
                    break
            }
        }
        else if(setKeybinds) {
            settings_Key[changeSetting] = event+''
            updateSettingButton(key)
            changeSetting = -1
            document.querySelector('#settings-selector').classList.add('full-opacity')

            setKeybinds = false
        }
    }
}

document.onwheel = function(event) {
    
    if (event.target.classList.contains('building')|| event.target.classList.contains('b-img')){
        let e = event.target
        if (e.classList.contains('b-img')){
            e = e.parentNode            
        }
        if (e.classList.contains('selected')) {
            
            e.style.setProperty("--rotate" ,(parseInt((getComputedStyle(e).getPropertyValue('--rotate').split('deg')[0]))+15)+'deg')
        }            
        //console.log(getComputedStyle(e).getPropertyValue('--rotate'))
    }
}
function toggleSettingsWindow() {
    document.getElementById('settings-window').classList.toggle('hide-page-up')
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
    //preveiw.querySelector('#mp-info-').innerHTML = machine

    preveiw.classList.toggle('hide-preview-left')
    preveiw.style.top = 'rem'
}
function hidePreview() {
    let preveiw = document.getElementById('machine-preview')
    preveiw.classList.toggle('hide-preview-left')
}

function machinePreviewHTML(machine) {    
    //console.log(machine)
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


// adding machines from selection and their moving ---------------------
class building {
    constructor(id,name,machIndex,catIndex,fillColor,outColor,efficiency,reciepie,x,y) {
        this.id = id
        this.name = name
        this.machIndex = machIndex
        this.catIndex = catIndex
        this.fillColor = fillColor
        this.outColor = outColor
        this.efficiency = efficiency
        this.reciepie = reciepie
        this.x = x
        this.y = y
    }

    move(horizontal,vertical) {
        this.x += horizontal
        this.y += vertical

        document.getElementById(this.id).style.setProperty("--x" ,(this.x) + "px")
        document.getElementById(this.id).style.setProperty("--y" ,(this.y) + "px")        
    }
    updatePosition(x,y) {
        this.x = x
        this.y = y
    }

    hasId(id) {
        if (this.id === id)
            return true
        else
            return false
    }

}
function getBuildingById(id) {
    for (let i = 0; i<buildings.length; i++) {
        if (buildings[i].id === id){
            return buildings[i]
        }
    }
    return null
}


function addBuilding(machIndex, catIndex) {
    let inputData = data.machines[machIndex][headings[machIndex]][catIndex]
    buildings.push(new building("b"+maxId,inputData.name,machIndex,catIndex,'#1e1e1e','#FA9549',100,'N/A',500,500))
    //console.log(buildings[buildings.length-1])

    document.getElementById('workspace').innerHTML += `
        <div id="b${maxId}" class="building" onclick="select(b${maxId})">
            <div class="portLine"></div>
            <img class="b-img" src="${inputData.url}">
            <div class="portLine"></div>
        </div>`

    

    //let portLines = document.getElementById('b'+maxId).innerHTML.getElementsByClassName('portLine')
    let bD = document.getElementById('b'+maxId)
    let bE = getBuildingById('b'+maxId)
    let bData = data.machines[bE.machIndex][headings[bE.machIndex]][bE.catIndex]
   
    for (let i = 0; i< parseInt(bData.conveyor_in);i++) {
        bD.getElementsByClassName('portLine')[0].innerHTML += `<div id="p${maxPortId}" class="inputPort port conveyor"></div>`
        maxPortId++
    }
    for (let i = 0; i< parseInt(bData.fluid_in);i++) {
        bD.getElementsByClassName('portLine')[0].innerHTML += `<div id="p${maxPortId}" class="inputPort port fluid"></div>`
        maxPortId++
    }
    for (let i = 0; i< parseInt(bData.conveyor_out);i++) {
        bD.getElementsByClassName('portLine')[1].innerHTML += `<div id="p${maxPortId}" class="outputPort port conveyor"></div>`
        maxPortId++
    }
    for (let i = 0; i< parseInt(bData.fluid_out);i++) {
        bD.getElementsByClassName('portLine')[1].innerHTML += `<div id="p${maxPortId}" class="outputPort port fluid"></div>`
        maxPortId++
    }

    let ports = bD.getElementsByClassName('port')
    for (let i = 0; i<ports.length; i++) {
        /*
        ports[i].addEventListener('click', function() {
            setLinePoint(ports[i])
        })
        */
        ports[i].setAttribute('onclick','setLinePoint(this)')
    }

    maxId++

    synchPowerIndicator()
    synchFactoryStats()
}
function removeBuilding() {
    let selected = document.getElementsByClassName('selected')
    for (let i=0; i<selected.length; i++) {
        //console.log(selected[i].id)
        buildings.splice(buildings.findIndex(obj => obj.id === selected[i].id), 1)
        selected[i].parentNode.removeChild(selected[i])
    }
    synchPowerIndicator()
    synchFactoryStats()
}


function setLinePoint(port) {
    if (port.classList.contains('inputPort')) {
        toPort = port
    } else if (port.classList.contains('outputPort')) {
        fromPort = port
    }
    if (fromPort !== null && toPort !== null) {
        document.getElementById('previewLine').style.display = 'none'
        drawLine(fromPort, toPort)
        fromPort = null
        toPort = null
    } 
    else if (fromPort !== null) {
        updateLinePosition(
            fromPort.getBoundingClientRect().x+5,
            fromPort.getBoundingClientRect().y+3.5, 
            fromPort.getBoundingClientRect().x+5,
            fromPort.getBoundingClientRect().y+3.5, 
            'previewLine'
        )

        document.addEventListener('mousemove', (e) => {
            updateLineOnMove(e, fromPort)
        })
        document.getElementById('previewLine').style.display = 'block'
    } 
    else if (toPort !== null) {
        updateLinePosition(
            toPort.getBoundingClientRect().x+5,
            toPort.getBoundingClientRect().y+3.5, 
            toPort.getBoundingClientRect().x+5,
            toPort.getBoundingClientRect().y+3.5, 
            'previewLine'
        )

        document.addEventListener('mousemove', (e) => {
            updateLineOnMove(e,toPort)
        })   
        document.getElementById('previewLine').style.display = 'block' 
    }
}

function drawLine(fromPort, toPort) {
    if (document.getElementById(`${fromPort.id}_${toPort.id}`) == null){
        document.getElementById('line-container').innerHTML += `<div id="${fromPort.id}_${toPort.id}" class="line"></div>`
    }
    updateLinePosition(fromPort.getBoundingClientRect().x+5,fromPort.getBoundingClientRect().y+3.5, toPort.getBoundingClientRect().x+5,toPort.getBoundingClientRect().y+3.5, `${fromPort.id}_${toPort.id}`)  
}
function updateLineOnMove(event, fromPort) {
    updateLinePosition(fromPort.getBoundingClientRect().x+5.2,fromPort.getBoundingClientRect().y+4, event.clientX, event.clientY, `previewLine`)
}

setInterval(checkMoving(), 500)

function checkMoving() {
    document.onmousemove = function moving(event) {
        let selectedElements = document.getElementsByClassName('moving')
        for (let x = 0; x<selectedElements.length; x++) {
            let e = selectedElements[x]
            
            e.style.setProperty("--x" ,(/*event.pageX*/event.clientX - mouseX) + "px")
            e.style.setProperty("--y" ,(/*event.pageY*/event.clientY - mouseY) + "px")
            buildings[e.id.substring(1)].updatePosition((/*event.pageX*/event.clientX - mouseX), (/*event.pageY*/event.clientY - mouseY))
            //console.log(buildings[e.id.substring(1)].x +":"+ buildings[e.id.substring(1)].y)
        }
        //console.log(buildings[selectedElements[0].id.substring(1)].x +":"+buildings[selectedElements[0].id.substring(1)].y)
    }
}
function moveAll(horizontal,vertical) {
    for (let i = 0; i<buildings.length; i++) {
        buildings[i].move(horizontal,vertical)
    }
}
// add buildings end ---------------------------------------------------

// actions on selecting an building
function select(selected) {
    switch(operation) {
        case 'move':
            mouseX = event.offsetX
            mouseY = event.offsetY
            selected.classList.toggle('selected')
            selected.classList.toggle('moving')            
            break
        case 'select':
            selected.classList.toggle('selected')
            document.getElementById('properties').classList.toggle('hide-right-smooth')     
            if (selected.classList.contains('selected')) {
                synchPropertiesByElement(selected)   
            } else {
                synchElementByProperties(selected)
            }
                
            break
        case 'add':
            break
        case 'delete':
            selected.classList.toggle('selected')
            removeBuilding()
            break
    }    
}

// operator changing
function setOperation(e) {
    operation = e
    let all = document.getElementsByClassName('op')
    for (let x=0; x<all.length; x++) {
        all[x].classList.add('operating')
        all[x].classList.remove('operating')
    }
    document.getElementById(e).querySelector('.op').classList.add('operating')

    switch(operation) {
        case 'move':
            document.querySelector(':root').style.setProperty('--building-cursor','all-scroll')
            break
        case 'select':
            document.querySelector(':root').style.setProperty('--building-cursor','pointer')
            break
        case 'add':
            document.querySelector('#item-menu').classList.remove('hide-menu-left')
            break
        case 'delete':
            document.querySelector(':root').style.setProperty('--building-cursor','url(https://pic.onlinewebfonts.com/svg/img_407448.png), auto')
            break
    }
    if (operation !== 'settings') {
        showCurrentTool()
    }

    // TODO:  remove stuff from other after changing tool
    if(operation !== 'move') {
        document.querySelector(':root').style.setProperty('--building-cursor','default')
    }
    if (operation !== 'select') {
        let p = document.getElementById('properties')
        if (!p.classList.contains('hide-right-smooth')) {
            p.classList.add('hide-right-smooth')
        }
        let s = document.getElementsByClassName('selected')
        for (let i = 0;i<s.length; i++) {
            s[i].classList.remove('selected')
        }
    }
    if (operation !== 'add') {
        document.querySelector('#item-menu').classList.add('hide-menu-left')
    }
    
}
function showCurrentTool() {
    document.getElementById('tool-indicator-value').innerHTML = operation
    document.getElementById('tool-indicator').classList.toggle('full-opacity-delay')
    setTimeout(()=>{
        document.getElementById('tool-indicator').classList.toggle('full-opacity-delay')
    }, 1000)
}

// reading properties out from inputs --------------------------------------
// synchronisation of range for efficiency
function synchInValueWithAnother(idFrom,idTo) {
    document.getElementById(idTo).value = document.getElementById(idFrom).value
}

function setColor(variable, id) {
    let e = document.getElementsByClassName('selected')
    for (let i = 0; i<e.length; i++) {
        e[i].style.setProperty(variable, document.querySelector('#'+id).value);
    }    
}

function synchElementByProperties(element) {
    let b = buildings[element.id.substring(1)]
    b.reciepie = document.getElementById('product').value
    b.efficiency = document.getElementById('eff-t-in').value
    b.fillColor = document.getElementById('fill-color').value
    b.outColor = document.getElementById('out-color').value
}
function synchPropertiesByElement(element){
    let b = buildings[element.id.substring(1)]
    
    document.getElementById('eff-t-in').value = b.efficiency
    synchInValueWithAnother('eff-t-in','eff-s-in')

    //console.log(document.getElementById('product').value)
    document.getElementById('product').value = b.reciepie

    document.getElementById('fill-color').value = b.fillColor

    document.getElementById('out-color').value = b.outColor
}

function synchPowerIndicator() {
    let energy = 0
    for (let i = 0; i<buildings.length; i++) {
        energy += data.machines[buildings[i].machIndex][headings[buildings[i].machIndex]][buildings[i].catIndex].power
    }
    document.getElementById('power').innerText = energy
}

function synchFactoryStats() {
    let f_builds = []

    // exe help functions
    for (let i = 0; i<buildings.length; i++) {
        if (alreadyAdded(buildings[i].name)) {
            incCount(buildings[i].name)
        }
        else {
            addBuildingObjCount(buildings[i].name)
        }
    }
        // help functions
        function addBuildingObjCount(name) {
            f_builds.push({"name":name, "count":1})
        }
        function alreadyAdded(name) {
            for (let i = 0; i<f_builds.length; i++) {
                if(f_builds[i].name === name){
                    return true
                }
            }
            return false
        }
        function incCount(name) {
            for (let i=0; i<f_builds.length; i++) {
                if (f_builds[i].name === name) {
                    f_builds[i].count++
                    return
                }
            }
        }
    
    // write to stats
    let f_build = document.getElementById('f-build')
    f_build.innerHTML = ''
    for (let i =0; i<f_builds.length; i++) {    
        f_build.innerHTML += `<div>${f_builds[i].count}x ${f_builds[i].name}</div>`
    }
    if (f_builds.length === 0) {
        f_build.innerHTML = `<div>No buildings placed</div>`
    }
}


// properties end ----------------------------------------------------------


// functions for settings -----------------
function recordPressedKey(index) {
    document.querySelector("#settings-selector").classList.remove('full-opacity')
    setKeybinds = true;
    changeSetting = index
}

function setupKeybindSettings() {
    let element = document.getElementById('settings-menu')
    for (let i = 0; i<settings_Key.length; i++) {
        element.innerHTML += `
        <div class="set-title">
            <div>${settings_Name[i]}</div>
            <div>
                <button id="rb-${i}" class="set-reset" data-id="${settings_Key[i]}" onclick="resetKeyBind(${i})">Reset</button> 
                <button id="sb-${i}" class="set-setting" onclick="recordPressedKey(${i})">${settings_Key[i]}</button>
            </div>
        </div>`
    }
    element.innerHTML += `
    <div class="set-title">
        <div>Complete Keybind Reset</div>
        <div>
            <button id="set-full-reset" class="set-reset" onclick="resetAllKeyBinds()">Reset All</button> 
        </div>
    </div>
    `
}

function updateSettingButton(key) {
    document.getElementById(`sb-${changeSetting}`).innerHTML = key
    document.getElementById(`rb-${changeSetting}`).classList.add('set-reset-changed')
    settings_Key[changeSetting] = key
}
function resetKeyBind(index) {
    document.getElementById(`sb-${index}`).innerHTML = document.getElementById('rb-'+index).getAttribute('data-id')
    settings_Key[index] = document.getElementById('rb-'+index).getAttribute('data-id')
    document.getElementById(`rb-${index}`).classList.remove('set-reset-changed')
}
function resetAllKeyBinds() {
    let rButtons = document.getElementsByClassName('set-reset')
    for (let i = 0; i<rButtons.length; i++) {
        resetKeyBind(rButtons[i].id.substring(3))
    }
    
}


// settings end ---------------------------

// calculate new line
function updateLinePosition(x1,y1,x2,y2,lineID) {
    let distance = Math.sqrt( ((x1-x2) * (x1-x2)) + ((y1-y2) * (y1-y2)) )
    
    let xMid = (x1+x2)/2
    let yMid = (y1+y2)/2

    salopeInRadian = Math.atan2(y1-y2,x1-x2)
    salopeInDegrees = (salopeInRadian * 180) / Math.PI

    let line = document.getElementById(lineID)
    line.style.width = distance+"px"
    line.style.top = yMid+"px"
    line.style.left = (xMid - (distance/2)) +"px"
    line.style.transform = 'rotate('+salopeInDegrees+'deg'
}


function loadButtons() {
    //factory stats  initialisation
    document.getElementById('f-stats-btn').onclick = function() {
        popUpPage('factory-stats')
    }
 
    /* on any click toggles
    document.getElementById('factory-stats').onclick = function() {
        popUpPage(document.getElementById('factory-stats'))
    }*/
    
}
function popUpPage(id) {
    document.getElementById(id).classList.toggle('hide-page-up')
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