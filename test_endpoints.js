const { spawn } = require('child_process');
const http = require('http');

console.log("Starting server...");
const server = spawn('node', ['./bin/www'], { cwd: __dirname });

server.stdout.on('data', (data) => console.log(`Server: ${data}`));
server.stderr.on('data', (data) => console.error(`Server Error: ${data}`));

setTimeout(async () => {
    try {
        console.log("Registering user...");
        const regRes = await fetch("http://localhost:3000/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "testuser5", password: "Password123!", email: "testuser5@example.com" })
        });
        const regText = await regRes.text();
        console.log("Register:", regRes.status, regText);

        console.log("Logging in...");
        const loginRes = await fetch("http://localhost:3000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "testuser5", password: "Password123!" })
        });
        const token = await loginRes.text();
        console.log("Login Token:", loginRes.status, token);

        console.log("Testing /me...");
        const meRes = await fetch("http://localhost:3000/api/v1/auth/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const meText = await meRes.text();
        console.log("Me:", meRes.status, meText);

    } catch (e) {
        console.error("Test Error:", e);
    } finally {
        server.kill();
        process.exit();
    }
}, 3000);
