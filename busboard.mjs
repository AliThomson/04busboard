import fetch from 'node-fetch';
import prompt from 'prompt-sync';


const isValidPostcode = (inputPostcode) => {
  let postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i;
  return postcodeRegEx.test(inputPostcode);
};

// GET POSTCODE
let postcode = '';
while (isValidPostcode(postcode) === false) {
  try {
    postcode = prompt()(`What is your postcode? `);
    if (isValidPostcode(postcode) === false) {
      throw "It's not a valid postcode.";
    }
  } catch (error) {
    console.log(error);
  }
}

// GET POSTCODE INFO
const postcodeInfo = await fetch(
  `https://api.postcodes.io/postcodes/${postcode}`
);
const postcodeResult = await postcodeInfo.json();

const longitude = postcodeResult.result.longitude;
const latitude = postcodeResult.result.latitude;

// GET BUSSTOP INFO

let radius = 200;
let busStopsResult = {};
let busStopPoints = 0;
let nearestTwoBusStops = [];

while (busStopPoints === 0) {
  try {
    const busStopsInfo = await fetch(
      `https://api.tfl.gov.uk/StopPoint/?lat=${latitude}&lon=${longitude}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}`
    );
    busStopsResult = await busStopsInfo.json();

    if (busStopsResult.stopPoints.length) {
      busStopPoints = busStopsResult.stopPoints.length;
    }
    if (busStopPoints === 0) {
      throw 'There are no bus stops nearby.';
    } else {
      const nearestBusStops = busStopsResult.stopPoints.sort(
        (busStopFirst, busStopSecond) => {
          return busStopFirst.distance - busStopSecond.distance;
        }
      );

      nearestTwoBusStops = nearestBusStops.slice(0, 2);
    }
  } catch (error) {
    busStopPoints = 0;
    console.log(error);
    console.log('Area expanding...');
    radius += 100;
    if (radius > 1500) {
      console.log('No available bus stops.');
      break;
    }
  }
}
// GET BUSSES FROM BUSSTOP INFO
for (let busStop of nearestTwoBusStops) {
  const getBusStopInformation = await fetch(
    `https://api.tfl.gov.uk/StopPoint/${busStop.naptanId}/Arrivals?StopType=NaptanPublicBusCoachTram&?app_key=f917a2c79ce74c30a426763cba9490f6`
  );
  const comingBuses = await getBusStopInformation.json();
  console.log(`${busStop.indicator}`);
  try {
    if (comingBuses.length === 0) {
      throw 'There are no busses coming to this bus stop.';
    } else {
      const nearestBuses = comingBuses.sort((firstBus, secondBus) => {
        return firstBus.timeToStation - secondBus.timeToStation;
      });

      const nearestFiveBuses = nearestBuses.slice(0, 5);

      for (let bus of nearestFiveBuses) {
        console.log(
          `Bus to ${bus.destinationName} towards ${bus.towards} in ${bus.timeToStation} seconds`
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
}