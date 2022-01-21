import readlineSync from "readline-sync";
import fetch from "node-fetch";
import winston from "winston";

function isValidPostcode(inputPC) { 
    let postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i; 
    return postcodeRegEx.test(inputPC); 
}

let inpPostCode = "";
while (isValidPostcode(inpPostCode) === false) {
    try {

    inpPostCode = readlineSync.question("Please input your post code: ");
    if (isValidPostcode(inpPostCode) === false) {
        throw "Invalid Postcode";
        }
    }
    catch (err) {
        inpPostCode = "";
        console.log("Postcode is invalid - please try again");

    }
}

const pcResponse = await fetch("https://api.postcodes.io/postcodes/" + encodeURI(inpPostCode));
const coords = await pcResponse.json();
//console.log("coords = " + coords.result.latitude);
let busStopRadius = 500;

let numberOfStops = 0;
while (numberOfStops === 0) {
    try {
        const bsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/?lat=" + coords.result.latitude + "&lon=" + coords.result.longitude + "&stopTypes=NaptanPublicBusCoachTram&radius=" + busStopRadius)
        const busStops = await bsResponse.json(); 

        numberOfStops = busStops.stopPoints.length
        console.log(busStops.stopPoints.length);
        if(busStops.stopPoints.length < 2) {
            throw "Your search did not return 2 bus stops.";
        }
    }
    catch (err) {
        numberOfStops = 0;
        busStopRadius = 1000;
        console.log("We are searchin wider area.");

    }
}


const firstTwoStops = busStops.stopPoints.slice(0,2);
//console.log("Busstops = " + busStops.stopPoints[0].naptanId);
// console.log(firstTwoStops)

for (let i=0; i<=1; i++) {
    let arrivalsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/" + firstTwoStops[i].naptanId + "/Arrivals");
    let arrivals = await arrivalsResponse.json();
        
    arrivals.sort(function(a, b) {
            return a.expectedArrival.substring(11,16).localeCompare(b.expectedArrival.substring(11,16));
        });

    const firstFiveArrivals = arrivals.slice(0,5);
        
    for (let bus of firstFiveArrivals) {
        console.log("Stop: " + bus.stationName);
        console.log("Bus no. " + bus.lineName + " to " + bus.destinationName + " is arriving at " + bus.expectedArrival.substring(11,16));
    }
}