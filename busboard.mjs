import fetch from 'node-fetch';
import readlineSync from 'readline-sync';

let userPostcode = "";

const askPostcode = () => {
    userPostcode = readlineSync.question("Please enter your post code: ")
    console.log(userPostcode);
}
askPostcode();


// const response = await fetch("https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals");
// const buses = await response.json();



const responsePostcode = await fetch(`https://api.postcodes.io/postcodes/${userPostcode}`);
const postCodeResponse = await responsePostcode.json();


const longitude = postCodeResponse.result.longitude;
const latitude = postCodeResponse.result.latitude;

console.log(longitude, latitude);

const responseRadius = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=150`);
const busStops = await responseRadius.json();

const firstTwoStop = busStops.stopPoints.slice(0, 2)
console.log(firstTwoStop);



// const response = await fetch("https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals");
// const buses = await response.json();

for (let stop of firstTwoStop) {


    const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stop.naptanId}/Arrivals`);
    const buses = await response.json();

   const sortedBuses = buses.sort((bus1, bus2) => bus1.timeToStation - bus2.timeToStation);

    const last5buses = sortedBuses.slice(0,5)

    console.log(`Buses for stop no: ${stop.naptanId}`)
     for(const bus of last5buses) {
    
    console.log("Bus to " + bus.destinationName + " arrving in " + bus.timeToStation + "seconds");
 
     }





   console.log(stop.naptanId);
}
// const sortedBuses = buses.sort((bus1, bus2) => bus1.timeToStation - bus2.timeToStation);

// const last5buses = sortedBuses.slice(0,5)


// for(const bus of last5buses) {
    
//     console.log("Bus to " + bus.destinationName + " arrving in " + bus.timeToStation + "seconds");
 
// }


