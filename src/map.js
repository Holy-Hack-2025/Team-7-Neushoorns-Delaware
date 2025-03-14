function setMapSrc(origin, destination, waypoints, mode) {
    const apiKey = 'AIzaSyAiNShtoakde7DND2RWroZLuRIwb5isgT8';
    const baseUrl = 'https://www.google.com/maps/embed/v1/directions';
    const src = `${baseUrl}?key=${apiKey}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints.join('|'))}&mode=${mode}`;
    document.getElementById('mapFrame').src = src;
}

setMapSrc('antwerpen', 'kortenberg', ['zaventem', 'nossegem'], 'driving');
