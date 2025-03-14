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
    const apiKey = 'AIzaSyAiNShtoakde7DND2RWroZLuRIwb5isgT8';
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
