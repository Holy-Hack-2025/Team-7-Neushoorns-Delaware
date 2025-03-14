let map, directionsService, directionsRenderer;
const api_Key = 'AIzaSyAiNShtoakde7DND2RWroZLuRIwb5isgT8';

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
        zoom: 10
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

function setMapSrc(origin, destination, waypoints, mode) {
    const apiKey = api_Key;
    const baseUrl = 'https://www.google.com/maps/embed/v1/directions';
    const src = `${baseUrl}?key=${apiKey}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints.join('|'))}&mode=${mode}`;

    document.getElementById('mapFrame').src = src;
}

async function getTravelTime(origin, destination, apiKey) {
    const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

    const requestData = {
        origin: { address: origin },
        destination: { address: destination }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const travelTimeSeconds = parseInt(data.routes[0].duration.replace("s", ""), 10);
            const travelTimeMinutes = Math.round(travelTimeSeconds / 60);
            return travelTimeMinutes;
        } else {
            throw new Error("No route found.");
        }
    } catch (error) {
        console.error("Error fetching travel time:", error);
        return null;
    }
}

async function getDistancesBetweenHotspots(hotspots, destination) {
    const distances = {};

    for (let i = 0; i < hotspots.length; i++) {
        distances[hotspots[i]] = {};

        for (let j = 0; j < hotspots.length; j++) {
            if (i !== j) {
                const travelTime = await getTravelTime(hotspots[i], hotspots[j], api_Key);
                distances[hotspots[i]][hotspots[j]] = travelTime;
            }
        }

        const travelTimeToDestination = await getTravelTime(hotspots[i], destination, api_Key);
        distances[hotspots[i]][destination] = travelTimeToDestination;
    }

    return distances;
}

function distributePeopleInBuses(people, destination, maxPeoplePerBus) {
    const buses = [];
    let currentBus = [];

    for (const person of people) {
        if (currentBus.length < maxPeoplePerBus) {
            currentBus.push(person);
        } else {
            buses.push(currentBus);
            currentBus = [person];
        }
    }

    if (currentBus.length > 0) {
        buses.push(currentBus);
    }

    return buses;
}

async function createOptimalRoutesForBuses(buses, destination) {
    const routes = [];

    for (const bus of buses) {
        const hotspots = bus.map(person => person.hotspot);
        const distances = await getDistancesBetweenHotspots(hotspots, destination);

        const route = calculateOptimalRoute(hotspots, distances, destination);
        routes.push(route);
    }

    return routes;
}

function calculateOptimalRoute(hotspots, distances, destination) {
    const route = [];
    const visited = new Set();
    let currentLocation = hotspots[0];

    while (visited.size < hotspots.length) {
        route.push(currentLocation);
        visited.add(currentLocation);

        let nextLocation = null;
        let shortestDistance = Infinity;

        for (const hotspot of hotspots) {
            if (!visited.has(hotspot) && distances[currentLocation][hotspot] < shortestDistance) {
                nextLocation = hotspot;
                shortestDistance = distances[currentLocation][hotspot];
            }
        }

        currentLocation = nextLocation;
    }

    route.push(destination);
    return route;
}