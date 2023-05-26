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
    document.querySelector(".inputField input").value = "";
    if (input.length < 2) {
        inputBox.placeholder = "input too little arguements"
        return;
    }
    input[1] = input[1].toUpperCase();
    if (input[1] != "ON" && input[1] != "OFF") {
        inputBox.placeholder = "input command not valid"
        return;
    }
    inputBox.placeholder = "Send command (format: <devnum> <command>)"
    httpPost(input[0], input[1])
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
        httpPost(devices[index], "DEL");
        devices.splice(index, 1); //delete or remove the li
        showTasks(".connectDev", ".devices", devices); //call the showTasks function
    } else {
        httpPost(running_devices[index], "OFF");
        running_devices.splice(index, 1); //delete or remove the li
        showTasks(".runningDev", ".running_devices", running_devices); //call the showTasks function

    }
}

deleteAllRun.onclick = ()=>{
    for (let i = 0; i < running_devices.length; i++) {
        httpPost(running_devices[i], "DEL");
    }

    running_devices = []; //empty the array
    showTasks(".runningDev", ".running_devices", running_devices); //call the showTasks function
}
deleteAllConn.onclick = ()=>{
    for (let i = 0; i < devices.length; i++) {
        httpPost(devices[i], "DEL");
    }
    devices = []; //empty the array
    showTasks(".connectDev", ".devices", devices); //call the showTasks function
}

function httpGet()
{
    var theUrl = "http://localhost:5000/device/info"
    var xmlHttp = new XMLHttpRequest();
    console.log("Sending Out GET request")
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    console.log("Server Responded GET: ", xmlHttp.responseText);
    return xmlHttp.responseText;
}

function get_running()
{
    var get_ret = JSON.parse(httpGet()); 
    if (running_devices != get_ret.running_dev || devices != get_ret.all_dev) {
        if (running_devices != get_ret.running_dev) running_devices = get_ret.running_dev;
        if (devices != get_ret.all_dev) devices = get_ret.all_dev;
        showTasks(".connectDev", ".devices", devices); //call the showTasks function
        showTasks(".runningDev", ".running_devices", running_devices); //call the showTasks function
    }
}

function httpPost(selectDev, comm)
{
    var info = {};
    info[selectDev] = comm;
    var theUrl = "http://localhost:5000/device/command"
    var xmlHttp = new XMLHttpRequest();
    console.log("Sending Out POST Command")
    xmlHttp.open( "POST", theUrl, false ); // false for synchronous request
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    var params = JSON.stringify(info)
    console.log(params)
    xmlHttp.send( params );
    console.log("Server received command: ", xmlHttp.responseText);
    return xmlHttp.responseText;
}

