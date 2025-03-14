function generateDays() {
    const form = document.getElementById('busUsageForm');
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const label = document.createElement('label');
        label.className = 'day';
        label.innerHTML = `<input type="checkbox" name="days" value="${day}"> ${day}`;
        form.appendChild(label);
    }
}

function saveBusUsage() {
    const username = localStorage.getItem("loggedInUser");
    if (!username) {
        alert("No user is logged in!");
        return;
    }

    const form = document.getElementById('busUsageForm');
    const formData = new FormData(form);
    const selectedDays = formData.getAll('days');

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userIndex = users.findIndex(user => user.username === username);

    if (userIndex !== -1) {
        users[userIndex].busUsage = selectedDays;
        localStorage.setItem("users", JSON.stringify(users)); 
        alert("Bus usage saved successfully!");
    } else {
        alert("User not found.");
    }
}

window.onload = function () {
    const username = localStorage.getItem("loggedInUser"); 
    if (!username) {
        alert("No user is logged in! Please log in first.");
        return;
    }

    generateDays();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.username === username);

    if (user && user.busUsage) {
        user.busUsage.forEach(day => {
            document.querySelector(`input[value="${day}"]`).checked = true;
        });
    }
};