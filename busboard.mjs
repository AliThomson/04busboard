import readlineSync from "readline-sync";

const busStopCode = readlineSync.question("Please input the stop code: ");
console.log(busStopCode);

import fetch from "node-fetch";

fetch("https://api.tfl.gov.uk/StopPoint/" + busStopCode + "/Arrivals")
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