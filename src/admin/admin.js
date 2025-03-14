const username = localStorage.getItem("loggedInUser");
if (!username) {
    alert("No user is logged in! Please log in first.");
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', loadHotspots);

function addHotspot() {
    const placeNameInput = document.getElementById('placeName');
    const placeName = placeNameInput.value.trim();
    if (placeName) {
        const hotspotContainer = document.getElementById('hotspotContainer');
        const hotspotItem = document.createElement('div');
        hotspotItem.className = 'hotspot-item';
        hotspotItem.innerHTML = `
            <span>${placeName}</span>
            <button onclick="deleteHotspot(this)">Delete</button>
        `;
        hotspotContainer.appendChild(hotspotItem);
        saveHotspot(placeName);
        placeNameInput.value = '';
    }
}

function deleteHotspot(button) {
    const hotspotItem = button.parentElement;
    const placeName = hotspotItem.querySelector('span').textContent;
    hotspotItem.remove();
    removeHotspot(placeName);
}

function saveHotspot(placeName) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === username);

    if (user) {
        user.hotspots = user.hotspots || [];
        user.hotspots.push(placeName);

        localStorage.setItem("users", JSON.stringify(users));
    }
}

function removeHotspot(placeName) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === username);

    if (user && user.hotspots) {
        user.hotspots = user.hotspots.filter(hotspot => hotspot !== placeName);

        localStorage.setItem("users", JSON.stringify(users));
    }
}

function loadHotspots() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === username);

    if (user && user.hotspots) {
        const hotspotContainer = document.getElementById('hotspotContainer');
        user.hotspots.forEach(placeName => {
            const hotspotItem = document.createElement('div');
            hotspotItem.className = 'hotspot-item';
            hotspotItem.innerHTML = `
                <span>${placeName}</span>
                <button onclick="deleteHotspot(this)">Delete</button>
            `;
            hotspotContainer.appendChild(hotspotItem);
        });
    }
}