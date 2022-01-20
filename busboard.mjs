import fetch from "node-fetch";

fetch("https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals")
    .then(response => response.json())
    .then(json => {
        for (const dis of json) {
            console.log("Stop: " + dis.stationName);
            console.log("Route: " + dis.lineName);
            console.log("Destination: " + dis.destinationName);
            console.log("Arriving: " + dis.expectedArrival);
        }
    })
    