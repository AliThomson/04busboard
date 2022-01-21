import readlineSync from "readline-sync";
import fetch from "node-fetch";

const inpPostCode = readlineSync.question("Please input your post code: ");inpPostCode


const pcResponse = await fetch("https://api.postcodes.io/postcodes/" + encodeURI(inpPostCode));
const coords = await pcResponse.json();
//console.log("coords = " + coords.result.latitude);

const bsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/?lat=" + coords.result.latitude + "&lon=" + coords.result.longitude + "&stopTypes=NaptanPublicBusCoachTram&radius=500")
const busStops = await bsResponse.json(); 
//console.log("Busstops = " + busStops.stopPoints[0].naptanId);
//console.log("Busstop ID = " + busStops.keys.stopPoints[0].naptanId);

//change fetch  .then to await for arrivals api


fetch("https://api.tfl.gov.uk/StopPoint/" + busStops.stopPoints[0].naptanId + "/Arrivals")
    .then(response => response.json())
    .then(json => {
        json.sort(function(a, b)
        {
            return a.expectedArrival.substring(11,16).localeCompare(b.expectedArrival.substring(11,16));
        });
        
        for (const bus of json) {
            console.log("Stop: " + bus.stationName);
            console.log("Bus no. " + bus.lineName + " to " + bus.destinationName + " is arriving at " + bus.expectedArrival.substring(11,16));
        }
    })    