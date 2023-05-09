devices = [];
running_devices = []
window.setInterval(get_running, 1000)
num_devices = 0;

const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const dev = document.querySelector(".devices");
const rundev = document.querySelector(".running_devices");
const deleteAllConn = document.querySelector(".footer .connRem");
const deleteAllRun = document.querySelector(".footer .runRem");

// onkeyup event
inputBox.onkeyup = ()=>{
    let userEnteredValue = inputBox.value; //getting user entered value
    if(userEnteredValue.trim() != 0){ //if the user value isn't only spaces
        addBtn.classList.add("active"); //active the add button
    }else{
        addBtn.classList.remove("active"); //unactive the add button
    }
}

showTasks(".connectDev", ".devices", devices); //call the showTasks function
showTasks(".runningDev", ".running_devices", running_devices); //call the showTasks function

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

addBtn.onclick = ()=>{ //when user click on plus icon button
    let input = inputBox.value.trim().split(/\s+/); //getting input field value
    if (input.length < 2) return;
    input[1] = input[1].toUpperCase();
    if (input[1] != "ON" && input[1] != "OFF") return;
    console.log(input[0], input[1]);
    httpPost(input[0], input[1])
    return;
}

function showTasks(queryNum, queryLi, data){
    document.querySelector(queryNum).textContent = data.length;
    let type = "";
    if (queryNum == ".connectDev") {
        type = 1
        if(data.length > 0){ //if array length is greater than 0
            deleteAllConn.classList.add("active"); //active the delete button
        }else{
            deleteAllConn.classList.remove("active"); //unactive the delete button
        }
    } else {
        type = 2
        if(data.length > 0){ //if array length is greater than 0
            deleteAllRun.classList.add("active"); //active the delete button
        }else{
            deleteAllRun.classList.remove("active"); //unactive the delete button
        }
    }
    let newLiTag = "";
    data.forEach((element, index) => {
        newLiTag += `<li>${element}<span class="icon" onclick="deleteTask(${index}, ${type})"><i class="fas fa-power-off"></i></span></li>`;
    });
    if (!data.length) {
        newLiTag +=`<li>None</li>`;
    }
    document.querySelector(queryLi).innerHTML = newLiTag; //adding new li tag inside ul tag
}

function deleteTask(index, type) {
    if (type == 1) {
        devices.splice(index, 1); //delete or remove the li
        showTasks(".connectDev", ".devices", devices); //call the showTasks function
    } else {
        running_devices.splice(index, 1); //delete or remove the li
        showTasks(".runningDev", ".running_devices", running_devices); //call the showTasks function

    }
}

deleteAllRun.onclick = ()=>{
    running_devices = []; //empty the array
    showTasks(".runningDev", ".running_devices", running_devices); //call the showTasks function
}
deleteAllConn.onclick = ()=>{
    devices = []; //empty the array
    showTasks(".connectDev", ".devices", devices); //call the showTasks function
}

function httpGet()
{
    var theUrl = "http://localhost:5000/device/info"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log(xmlHttp.responseText);
    return xmlHttp.responseText;
}

function get_running()
{
    var get_ret = JSON.parse(httpGet()); 
    running_devices = get_ret.running_dev;
    devices = get_ret.all_dev;
    showTasks(".connectDev", ".devices", devices); //call the showTasks function
}

function httpPost(selectDev, comm)
{
    var info = {};
    info[selectDev] = comm;
    var theUrl = "http://localhost:5000/device/command"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    var params = JSON.stringify(info)
    console.log(params)
    xmlHttp.send( params );
    console.log(xmlHttp.responseText);
    return xmlHttp.responseText;
}

function start(){}
//    devices.push({ name: 'abc', status: 'on' });
//    devices.push({ name: 'ghwi', status: 'off' });
//    devices.push({ name: 'gdhi', status: 'off' });
//    devices.push({ name: 'weghi', status: 'off' });
//    devices.push({ name: 'ghisd', status: 'off' });
//    devices.push({ name: 'ghsdis', status: 'on' });
//    devices.push({ name: 'ghi', status: 'off' });
//    devices.push({ name: 'gsdhid', status: 'on' });
//    devices.push({ name: 'ghisd', status: 'off' });
//    devices.push({ name: 'ghisd', status: 'off' });
//    for(i = 0; i < devices.length; i++){
//
//        if (10000 > devices.length){
//            var myDiv = document.getElementById("GFG");
//
//
//            var button = document.createElement('BUTTON');
//
//
//            var text = document.createTextNode(devices[i].name);
//
//
//            button.appendChild(text);
//            button.id = i;
//            button.addEventListener("click", function() {
//                if(this.status == "off"){
//                    his.status = "on"
//                }
//                else{
//                    this.status = "off"
//                }
//                console.log("Device Name: ",this.name);
//                console.log("Device State;",this.status);
//
//
//            });
//
//            myDiv.appendChild(button);
//            num_devices += 1;
//        }
//    }           
//}
//
//
function status_in() {}
//    for(i = 0; i < devices.length; i++){
//        console.log("Loaded Devices (Smart Plugs)")
//        console.log("Device", i, "Name: ",devices[i].name);
//        console.log("Device", i, "Stats: ",devices[i].status);
//        var ard= document.getElementById("freeform").value;
//        console.log("Ardunio Code;",ard);
//    }
//
//}
//
function add_device() {
    var name = document.getElementById("freeform2").value.trim()
    console.log(name);

    devices.push({name, status: 'off'})
    num_devices += 1;
    var myDiv = document.getElementById("GFG");
    var button = document.createElement('BUTTON');

    var text = document.createTextNode(devices[num_devices-1].name);

    button.appendChild(text);
    button.id = num_devices;
    button.onclick = "button_update(this.id)"
    console.log(button)

    myDiv.appendChild(button);
    return;
    for(i = 0; i < devices.length; i++){
        console.log("Device Name: ",devices[i].name);
        console.log("Device State;",devices[i].status);

    }
    console.log(num_devices);
}
