function authenticate() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Get stored users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching credentials
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        if (user.role === "admin") {
            localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store session
            window.location.href = 'admin/index.html'; // Redirect to admin page
        } else {
            alert('Access denied! You are not an admin.');
        }
    } else {
        alert('Invalid username or password.');
    }
}