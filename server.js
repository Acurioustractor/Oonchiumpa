const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Handle the root path
    let filePath = req.url === '/' ? './index.html' : '.' + req.url;
    
    // Handle direct page requests without extension
    if (req.url === '/stories') {
        filePath = './stories.html';
    } else if (req.url === '/impact') {
        filePath = './impact.html';
    } else if (req.url === '/strategy') {
        filePath = './strategy.html';
    }
    
    // Get the file extension
    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // Read the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found - redirect to index
                fs.readFile('./index.html', (err, content) => {
                    if (err) {
                        res.writeHead(500);
                        res.end(`Server Error: ${err.code}`);
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Available pages:');
    console.log('  - Home: http://localhost:3000/');
    console.log('  - Stories: http://localhost:3000/stories');
    console.log('  - Impact: http://localhost:3000/impact');
    console.log('  - Strategy: http://localhost:3000/strategy');
    console.log('Press Ctrl+C to stop the server');
}); 