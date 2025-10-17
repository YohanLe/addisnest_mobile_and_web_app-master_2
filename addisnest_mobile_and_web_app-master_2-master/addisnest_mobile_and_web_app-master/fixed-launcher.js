const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Addisnest Application...');
console.log('===========================================================');

// Start backend server
console.log('Starting backend server on port 7002...');
const backend = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit'
});

// Wait a moment for backend to start, then start frontend
setTimeout(() => {
    console.log('Starting frontend server on port 5173...');
    const frontend = spawn('npx', ['vite'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    frontend.on('error', (err) => {
        console.error('Frontend server error:', err);
    });

    frontend.on('close', (code) => {
        console.log(`Frontend server exited with code ${code}`);
    });
}, 3000);

backend.on('error', (err) => {
    console.error('Backend server error:', err);
});

backend.on('close', (code) => {
    console.log(`Backend server exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    process.exit();
});

console.log('===========================================================');
console.log('Frontend will be available at: http://localhost:5173');
console.log('Backend API will be available at: http://localhost:7002');
console.log('===========================================================');
