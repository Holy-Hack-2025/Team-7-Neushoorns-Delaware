function authenticate() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Load users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user in database
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", username); // Store logged-in user
        alert("Login successful!");
        window.location.href = 'employee/index.html';
    } else {
        alert("Invalid username or password.");
    }
}