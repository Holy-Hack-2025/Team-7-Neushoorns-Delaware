function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const usersTableBody = document.getElementById("usersTableBody");
    const adminsTableBody = document.getElementById("adminsTableBody");
    const hotspotsList = document.getElementById("hotspotsList");

    usersTableBody.innerHTML = ""; // Clear previous entries
    adminsTableBody.innerHTML = ""; // Clear previous entries
    hotspotsList.innerHTML = ""; // Clear previous entries

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.busUsage ? user.busUsage.join(", ") : "None"}</td>
        `;
        if (user.role === 'admin') {
            adminsTableBody.appendChild(row);
            if (user.hotspots) {
                const hotspots = document.createElement("div");
                hotspots.innerText = `Hotspots: ${user.hotspots.join(", ")}`;
                hotspotsList.appendChild(hotspots);
            }
        } else {
            usersTableBody.appendChild(row);
        }
    });
}


window.onload = loadUsers;