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

let busStopRadius = 500;
let numberOfStops = 0;
let busStops = {};

while (numberOfStops === 0) {
    try {
        const bsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/?lat=" + coords.result.latitude + "&lon=" + coords.result.longitude + "&stopTypes=NaptanPublicBusCoachTram&radius=" + busStopRadius)
        busStops = await bsResponse.json(); 

        numberOfStops = busStops.stopPoints.length;
        //console.log(numberOfStops);
        if(numberOfStops < 2) {
            throw "Your search returned less than 2 bus stops. Widening search area...";
        }
    }
    catch (err) {
        numberOfStops = 0;
        busStopRadius = busStopRadius + 500;
        if (busStopRadius > 4000) {
            console.error("Sorry, your postcode did not return any buses");
        } else {
            console.log(err);
        }

    }
}

const firstTwoStops = busStops.stopPoints.slice(0,2);

for (let i=0; i<=1; i++) {

    let arrivalsResponse = await fetch("https://api.tfl.gov.uk/StopPoint/" + firstTwoStops[i].naptanId + "/Arrivals");
    let arrivals = await arrivalsResponse.json();

    console.log("Stop = " + firstTwoStops[i].commonName);
    
    try {
        if (arrivals != "") {
                    
            arrivals.sort(function(a, b) {
                    return a.expectedArrival.substring(11,16).localeCompare(b.expectedArrival.substring(11,16));
                });

            let firstFiveArrivals = arrivals.slice(0,5);
            for (let bus of firstFiveArrivals) {
                console.log("Bus no. " + bus.lineName + " to " + bus.destinationName + " is arriving at " + bus.expectedArrival.substring(11,16));
            }
        } else {
            throw "Sorry, no buses scheduled to arrive";
        }
    }
    catch (err) {
        console.log(err);
    }

}