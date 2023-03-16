const host = '127.0.0.1'
const port = '1883'
const connectUrl = `mqtt://${host}:${port}`
const clientId = "rpi_client2"
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'group26',
    password: 'group26',
    reconnectPeriod: 1000,
})

client.on('connect', () => {
    console.log('Connected')
})

devices = [];
window.setInterval(status_in, 1000)
num_devices = 0;
function start(){
    devices.push({ name: 'Plug 1', status: 'on' });
    for(i = 0; i < devices.length; i++){

        if (10000 > devices.length){
            var myDiv = document.getElementById("GFG");


            var button = document.createElement('BUTTON');


            var text = document.createTextNode(devices[i].name);


            button.appendChild(text);
            button.id = i;
            button.addEventListener("click", function() {
                if(this.status == "off"){
                    this.status = "on"
                    client.publish('rpi/broadcast', 'on', { qos: 0, retain: false }, function (error) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log('Published')
                        }
                    })
                }
                
                else{
                    this.status = "off"
                    client.publish('rpi/broadcast', 'off', { qos: 0, retain: false }, function (error) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log('Published')
                        }
                    })
                }
                console.log("Device Name: ",this.name);
                console.log("Device State;",this.status);
                
                
            });

            myDiv.appendChild(button);
            num_devices += 1;
        }
    }           
}


function status_in() {
    for(i = 0; i < devices.length; i++){
        console.log("Loaded Devices (Smart Plugs)")
        console.log("Device", i, "Name: ",devices[i].name);
        console.log("Device", i, "Stats: ",devices[i].status);
        var ard= document.getElementById("freeform").value;
        console.log("Ardunio Code;",ard);
    }
    
}

function add_device(){
    var name = document.getElementById("freeform2").value

    devices.push({name, status: 'off'})
    num_devices += 1;
    var myDiv = document.getElementById("GFG");
    var button = document.createElement('BUTTON');

    var text = document.createTextNode(devices[num_devices-1].name);

    button.appendChild(text);
    button.id = num_devices;
    button.onclick = "button_update(this.id)"

    myDiv.appendChild(button);
    for(i = 0; i < devices.length; i++){
        console.log("Device Name: ",devices[i].name);
        console.log("Device State;",devices[i].status);
        
    }
    console.log(num_devices);
}