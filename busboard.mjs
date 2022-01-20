import readlineSync from "readline-sync";
import fetch from "node-fetch";

const inpPostCode = readlineSync.question("Please input your post code: ");

const pcResponse = await fetch("api.postcodes.io/postcodes/" + inpPostCode);
const coords = await pcResponse.json();

const bsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/?lat=" + coords.latitude + "&lon=" + coords.longitude + "&stopTypes=NaptanPublicBusCoachTram&radius=500")
const busStops = await bsResponse.json(); 


//change url to use busStops.naptanID
//change fetch  .then to await for arrivals api


fetch("https://api.tfl.gov.uk/StopPoint/490008110N/Arrivals")
    .then(response => response.json())
    .then (json => {
        json.sort(function(a, b)
        {
            return a.expectedArrival.substring(11,16).localeCompare(b.expectedArrival.substring(11,16));
        });
        
        for (const bus of json) {
            console.log("Stop: " + bus.stationName);
            console.log("Bus no. " + bus.lineName + " to " + bus.destinationName + " is arriving at " + bus.expectedArrival.substring(11,16));
        }
    })    