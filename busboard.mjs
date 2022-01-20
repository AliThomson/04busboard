import fetch from 'node-fetch';

const response = await fetch("https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals");
const buses = await response.json();



const sortedBuses = buses.sort((bus1, bus2) => bus1.timeToStation - bus2.timeToStation);

const last5buses = sortedBuses.slice(0,5)


for(const bus of last5buses) {
    
    console.log("Bus to " + bus.destinationName + " arrving in " + bus.timeToStation + "seconds");
 
}


