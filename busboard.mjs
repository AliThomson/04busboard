import readlineSync from "readline-sync";
import fetch from "node-fetch";

const inpPostCode = readlineSync.question("Please input your post code: ");inpPostCode


const pcResponse = await fetch("https://api.postcodes.io/postcodes/" + encodeURI(inpPostCode));
const coords = await pcResponse.json();
//console.log("coords = " + coords.result.latitude);

const bsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/?lat=" + coords.result.latitude + "&lon=" + coords.result.longitude + "&stopTypes=NaptanPublicBusCoachTram&radius=1900")
const busStops = await bsResponse.json(); 
//console.log("Busstops = " + busStops.stopPoints[0].naptanId);

for (let i=0;i<2;i++) {
    let arrivalsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/" + busStops.stopPoints[i].naptanId + "/Arrivals");
    let arrivals = await arrivalsResponse.json();
       
    arrivals.sort(function(a, b) {
            return a.expectedArrival.substring(11,16).localeCompare(b.expectedArrival.substring(11,16));
        });
        
        for (let bus of arrivals) {
            console.log("Stop: " + bus.stationName);
            console.log("Bus no. " + bus.lineName + " to " + bus.destinationName + " is arriving at " + bus.expectedArrival.substring(11,16));
        }
    }  