import fetch from 'node-fetch';
import readlineSync from 'readline-sync';
import winston from 'winston'

function isValidPostcode(p) { 
    let postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i; 
    return postcodeRegEx.test(p); 
}
console.log(isValidPostcode("nw51tl"))

// while(isValidPostcode(p) === false) {
//     try {
//         throw new Error ("Invalid Postcode. Please try again!")
//     }
//     catch(err) {
//         console.error("Invalid Postcode. Please try again!")
//     }
// }

let userPostcode = "";

const askPostcode = () => {
    userPostcode = readlineSync.question("Please enter your post code: ")
    
}
askPostcode();




const responsePostcode = await fetch(`https://api.postcodes.io/postcodes/${userPostcode}`);
const postCodeResponse = await responsePostcode.json();


const longitude = postCodeResponse.result.longitude;
const latitude = postCodeResponse.result.latitude;



const responseRadius = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=1000`);
const busStops = await responseRadius.json();

const firstTwoStop = busStops.stopPoints.slice(0, 2)


for (let stop of firstTwoStop) {


    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stop.naptanId}/Arrivals`);
    const buses = await response.json();
    
    

   const sortedBuses = buses.sort((bus1, bus2) => bus1.timeToStation - bus2.timeToStation);

    const last5buses = sortedBuses.slice(0,5)

    
     for(const bus of last5buses) {

    console.log(`[${bus.stationName}]: Bus to ${bus.destinationName} arrving in ${bus.timeToStation} seconds`);
 
     }

}


